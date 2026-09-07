import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
} from 'firebase/firestore';
import { productCategories, supplierStatuses } from './constants';
import { auth, db, isFirebaseConfigured } from './firebase/app';
import { ensureSeeded } from './firebase/seed';

const DEMO_EMAIL = 'vendor@gmail.com';
const DEMO_NAME = 'Clayton Santos';
const collections = ['orders', 'products', 'suppliers', 'customers', 'transactions'];
const searchFields = {
    orders: ['userName', 'email'],
    products: ['name', 'category'],
    suppliers: ['name', 'email', 'company'],
    customers: ['name', 'email', 'company'],
};

function requireFirebase() {
    if (!isFirebaseConfigured() || !auth || !db) {
        throw new Error('Firebase is not configured. Add VITE_FIREBASE_* values to your .env file.');
    }
}

function requireUser() {
    requireFirebase();
    if (!auth.currentUser) {
        localStorage.removeItem('ep_token');
        throw new Error('Authentication required');
    }
}

function parseRequest(path, options) {
    const [pathname, query = ''] = path.split('?');
    return {
        pathname,
        query: Object.fromEntries(new URLSearchParams(query)),
        method: String(options.method || 'GET').toUpperCase(),
        body: options.body ? JSON.parse(options.body) : {},
    };
}

function toItem(snapshot) {
    return { _id: snapshot.id, ...snapshot.data() };
}

async function listCollection(name) {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map(toItem);
}

function queryItems(items, query, name) {
    const search = String(query.search || '').trim().toLowerCase();
    const sortField = String(query.sort || 'createdAt');
    const order = query.order === 'asc' ? 1 : -1;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const fields = searchFields[name] || ['name'];
    let next = [...items];
    if (search) {
        next = next.filter((item) => fields.some((field) => String(item[field] || '').toLowerCase().includes(search)));
    }
    next.sort((a, b) => String(a[sortField] || '').localeCompare(String(b[sortField] || ''), undefined, { numeric: true }) * order);
    return {
        items: next.slice((page - 1) * limit, page * limit),
        pagination: { total: next.length, page, limit, pages: Math.max(1, Math.ceil(next.length / limit)) },
    };
}

function validatePayload(name, payload) {
    const required = name === 'products'
        ? ['name', 'category', 'stock', 'suppliers', 'price']
        : name === 'suppliers'
            ? ['name', 'address', 'company', 'deliveryDate', 'amount', 'status']
            : name === 'customers'
                ? ['name', 'email', 'address', 'phone', 'registerDate']
                : [];
    const missing = required.find((field) => payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === '');
    if (missing) return `${missing} is required`;
    if (name === 'products' && !productCategories.includes(payload.category)) return 'Invalid product category';
    if (name === 'suppliers' && !supplierStatuses.includes(payload.status)) return 'Invalid supplier status';
    if (name === 'customers' && !/^\S+@\S+\.\S+$/.test(payload.email)) return 'Invalid email';
    for (const field of ['stock', 'price', 'amount']) {
        if (payload[field] !== undefined && (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) {
            return `${field} must be a non-negative number`;
        }
    }
    return null;
}

function authMessage(error) {
    const code = error?.code || '';
    if (code === 'auth/invalid-email') return 'Enter a valid email';
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        return 'Invalid email or password';
    }
    if (code === 'auth/too-many-requests') return 'Too many attempts. Try again later.';
    if (code === 'auth/network-request-failed') return 'Network error. Check your connection.';
    if (code === 'auth/operation-not-allowed') return 'Enable Email/Password sign-in in Firebase Authentication.';
    return error.message || 'Something went wrong';
}

async function login(email, password) {
    requireFirebase();
    if (!/^\S+@\S+\.\S+$/.test(email || '') || !password) {
        throw new Error('Valid email and password are required');
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        const canBootstrap = email === DEMO_EMAIL && ['auth/user-not-found', 'auth/invalid-credential'].includes(error.code);
        if (!canBootstrap) throw new Error(authMessage(error));
        try {
            const created = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(created.user, { displayName: DEMO_NAME });
        } catch (createError) {
            if (createError.code === 'auth/email-already-in-use') throw new Error('Invalid email or password');
            throw new Error(authMessage(createError));
        }
    }
    try {
        await ensureSeeded();
    } catch (error) {
        if (error.code === 'permission-denied') {
            throw new Error('Firestore blocked the write. Open Firestore in test mode or publish firestore.rules.');
        }
        throw error;
    }
    const token = await auth.currentUser.getIdToken();
    localStorage.setItem('ep_token', token);
    return {
        token,
        user: {
            name: auth.currentUser.displayName || DEMO_NAME,
            email: auth.currentUser.email,
            role: 'admin',
        },
    };
}

async function handleCollection(pathname, method, query, body) {
    const parts = pathname.split('/').filter(Boolean);
    const name = parts[0];
    const itemId = parts[1];
    if (!collections.includes(name)) throw new Error('Something went wrong');

    if (name === 'customers' && itemId && method === 'GET') {
        const snapshot = await getDoc(doc(db, 'customers', itemId));
        if (!snapshot.exists()) throw new Error('Customer not found');
        const customer = toItem(snapshot);
        const history = (await listCollection('orders')).filter((order) => order.email === customer.email);
        return { customer, history };
    }

    if (!itemId && method === 'GET') {
        const result = queryItems(await listCollection(name), query, name);
        return { [name]: result.items, ...(name === 'products' ? { categories: productCategories } : {}), pagination: result.pagination };
    }

    if (!itemId && method === 'POST') {
        const validationError = validatePayload(name, body);
        if (validationError) throw new Error(validationError);
        const created = await addDoc(collection(db, name), { ...body, createdAt: new Date().toISOString() });
        return { _id: created.id, createdAt: new Date().toISOString(), ...body };
    }

    if (itemId && method === 'PUT') {
        const snapshot = await getDoc(doc(db, name, itemId));
        if (!snapshot.exists()) throw new Error(`${name} item not found`);
        const payload = { ...snapshot.data(), ...body };
        const validationError = validatePayload(name, payload);
        if (validationError) throw new Error(validationError);
        await updateDoc(doc(db, name, itemId), body);
        return { _id: itemId, ...payload };
    }

    if (itemId && method === 'DELETE') {
        const snapshot = await getDoc(doc(db, name, itemId));
        if (!snapshot.exists()) throw new Error(`${name} item not found`);
        await deleteDoc(doc(db, name, itemId));
        return { message: 'Deleted' };
    }

    throw new Error('Something went wrong');
}

export async function request(path, options = {}) {
    const { pathname, query, method, body } = parseRequest(path, options);

    if (pathname === '/user/login' && method === 'POST') return login(body.email, body.password);
    if (pathname === '/user/refresh' && method === 'POST') {
        requireUser();
        const token = await auth.currentUser.getIdToken(true);
        localStorage.setItem('ep_token', token);
        return { token };
    }
    if (pathname === '/user/logout') {
        if (auth?.currentUser) await signOut(auth);
        localStorage.removeItem('ep_token');
        localStorage.removeItem('ep_refresh');
        return { message: 'Logged out successfully' };
    }

    requireUser();
    if (pathname === '/user/user-info') {
        return {
            name: auth.currentUser.displayName || DEMO_NAME,
            email: auth.currentUser.email,
            role: 'admin',
        };
    }
    if (pathname === '/dashboard') {
        await ensureSeeded();
        const [products, suppliers, customers, transactions] = await Promise.all([
            listCollection('products'),
            listCollection('suppliers'),
            listCollection('customers'),
            listCollection('transactions'),
        ]);
        const recent = queryItems(customers, { limit: 5, sort: 'createdAt', order: 'desc' }, 'customers');
        return {
            statistics: { products: products.length, suppliers: suppliers.length, customers: customers.length },
            recentCustomers: recent.items,
            transactions,
        };
    }
    return handleCollection(pathname, method, query, body);
}

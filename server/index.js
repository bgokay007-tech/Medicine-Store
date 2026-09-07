import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 4000;
const secret = process.env.JWT_SECRET || 'local-development-secret';
const id = () => Math.random().toString(36).slice(2, 10);
const productCategories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];
const supplierStatuses = ['Active', 'Deactive'];
const productPhotos = [
    'https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg',
    'https://i.ibb.co/Hg0zZkQ/shop-4-7-1000x1000-min.jpg',
    'https://i.ibb.co/02WmJdc/5-19-1000x1000-min.jpg',
    'https://i.ibb.co/GxTVSVk/shop-4-9-1000x1000-min.jpg',
    'https://i.ibb.co/X330FTj/shop-4-10-1000x1000-min.jpg',
];
const customersSeed = [
    { name: 'Sarah Wilson', email: 'sarah.wilson@email.com', spent: 482.5, country: 'United States', address: '24 Park Avenue', phone: '+1 202 555 0188', registerDate: '24 Oct 2024', photo: 'https://i.pravatar.cc/72?img=47' },
    { name: 'James Anderson', email: 'james.anderson@email.com', spent: 326.2, country: 'Canada', address: '18 King Street', phone: '+1 416 555 0124', registerDate: '20 Oct 2024', photo: 'https://i.pravatar.cc/72?img=12' },
    { name: 'Emily Johnson', email: 'emily.johnson@email.com', spent: 214.75, country: 'United Kingdom', address: '7 Grove Road', phone: '+44 20 7946 0321', registerDate: '18 Oct 2024', photo: 'https://i.pravatar.cc/72?img=32' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', spent: 190, country: 'Australia', address: '42 Collins Street', phone: '+61 2 5550 8010', registerDate: '12 Oct 2024', photo: 'https://i.pravatar.cc/72?img=15' },
    { name: 'Olivia Martinez', email: 'olivia.martinez@email.com', spent: 168, country: 'France', address: '9 Rue Lafayette', phone: '+33 1 5555 0190', registerDate: '10 Oct 2024', photo: 'https://i.pravatar.cc/72?img=5' },
    { name: 'Daniel Lee', email: 'daniel.lee@email.com', spent: 142.4, country: 'United States', address: '15 Oak Lane', phone: '+1 312 555 0144', registerDate: '08 Oct 2024', photo: 'https://i.pravatar.cc/72?img=8' },
    { name: 'Sophia Rossi', email: 'sophia.rossi@email.com', spent: 126, country: 'Italy', address: '3 Via Roma', phone: '+39 02 555 0177', registerDate: '05 Oct 2024', photo: 'https://i.pravatar.cc/72?img=20' },
    { name: 'Noah Patel', email: 'noah.patel@email.com', spent: 98.2, country: 'New Zealand', address: '88 Queen Street', phone: '+64 9 555 0110', registerDate: '02 Oct 2024', photo: 'https://i.pravatar.cc/72?img=33' },
    { name: 'Liam Chen', email: 'liam.chen@email.com', spent: 76.5, country: 'Singapore', address: '21 Orchard Road', phone: '+65 6555 0188', registerDate: '28 Sep 2024', photo: 'https://i.pravatar.cc/72?img=11' },
    { name: 'Ava Kim', email: 'ava.kim@email.com', spent: 54, country: 'South Korea', address: '10 Gangnam-daero', phone: '+82 2 555 0133', registerDate: '22 Sep 2024', photo: 'https://i.pravatar.cc/72?img=9' },
];
const productsSeed = [
    { name: 'Aspirin', category: 'Medicine', stock: 12, suppliers: 'Square', price: 89.66 },
    { name: 'Paracetamol', category: 'Medicine', stock: 19, suppliers: 'Acme', price: 34.16 },
    { name: 'Ibuprofen', category: 'Head', stock: 9, suppliers: 'Beximco', price: 53.76 },
    { name: 'Acetaminophen', category: 'Hand', stock: 14, suppliers: 'ACI', price: 28.57 },
    { name: 'Naproxen', category: 'Orthopedic Products', stock: 10, suppliers: 'Uniliver', price: 56.34 },
    { name: 'Amoxicillin', category: 'Medicine', stock: 25, suppliers: 'Square', price: 45.99 },
    { name: 'Lisinopril', category: 'Medicine', stock: 17, suppliers: 'Acme', price: 29.88 },
    { name: 'Ciprofloxacin', category: 'Head', stock: 11, suppliers: 'Beximco', price: 38.45 },
    { name: 'Hydrochlorothiazide', category: 'Hand', stock: 22, suppliers: 'ACI', price: 24.76 },
    { name: 'Prednisone', category: 'Orthopedic Products', stock: 15, suppliers: 'Uniliver', price: 48.99 },
    { name: 'Propranolol', category: 'Medicine', stock: 18, suppliers: 'Square', price: 35.66 },
    { name: 'Omeprazole', category: 'Medicine', stock: 14, suppliers: 'Acme', price: 42.16 },
    { name: 'Diazepam', category: 'Head', stock: 8, suppliers: 'Beximco', price: 27.76 },
    { name: 'Simvastatin', category: 'Hand', stock: 30, suppliers: 'ACI', price: 18.57 },
    { name: 'Tramadol', category: 'Orthopedic Products', stock: 13, suppliers: 'Uniliver', price: 52.34 },
    { name: 'Losartan', category: 'Medicine', stock: 20, suppliers: 'Square', price: 31.99 },
    { name: 'Metformin', category: 'Medicine', stock: 12, suppliers: 'Acme', price: 22.88 },
    { name: 'Alprazolam', category: 'Head', stock: 9, suppliers: 'Beximco', price: 47.76 },
    { name: 'Atorvastatin', category: 'Hand', stock: 18, suppliers: 'ACI', price: 19.57 },
    { name: 'Zolpidem', category: 'Orthopedic Products', stock: 16, suppliers: 'Uniliver', price: 41.34 },
    { name: 'Folic Acid', category: 'Vitamins & Supplements', stock: 14, suppliers: 'Square', price: 15.66 },
    { name: 'Calcium Carbonate', category: 'Vitamins & Supplements', stock: 21, suppliers: 'Acme', price: 18.16 },
    { name: 'Vitamin D', category: 'Vitamins & Supplements', stock: 16, suppliers: 'Beximco', price: 12.76 },
    { name: 'Fish Oil', category: 'Vitamins & Supplements', stock: 25, suppliers: 'ACI', price: 23.57 },
    { name: 'Multivitamins', category: 'Vitamins & Supplements', stock: 19, suppliers: 'Uniliver', price: 17.34 },
    { name: 'Toothpaste', category: 'Dental Care', stock: 30, suppliers: 'Square', price: 6.66 },
    { name: 'Mouthwash', category: 'Dental Care', stock: 25, suppliers: 'Acme', price: 8.16 },
    { name: 'Toothbrush', category: 'Dental Care', stock: 20, suppliers: 'Beximco', price: 4.76 },
    { name: 'Facial Cleanser', category: 'Skin Care', stock: 14, suppliers: 'ACI', price: 11.57 },
    { name: 'Moisturizer', category: 'Skin Care', stock: 18, suppliers: 'Uniliver', price: 13.34 },
];
const suppliersSeed = [
    { name: 'Alex Shatov', email: 'alex.shatov@square.com', address: 'Mirpur-1', company: 'Square', deliveryDate: '19 Sep 2023', amount: 6952.53, status: 'Active', photo: 'https://i.pravatar.cc/72?img=3' },
    { name: 'Philip Harbach', email: 'philip.harbach@acme.com', address: 'Dhanmondi', company: 'Acme', deliveryDate: '19 Sep 2023', amount: 8527.58, status: 'Active', photo: 'https://i.pravatar.cc/72?img=13' },
    { name: 'Mirko Fisuk', email: 'mirko.fisuk@beximco.com', address: 'Uttara-6', company: 'Beximco', deliveryDate: '19 Sep 2023', amount: 2698.5, status: 'Active', photo: 'https://i.pravatar.cc/72?img=14' },
    { name: 'Olga Semklo', email: 'olga.semklo@aci.com', address: 'Gulshan-1', company: 'ACI', deliveryDate: '19 Sep 2023', amount: 9852.64, status: 'Active', photo: 'https://i.pravatar.cc/72?img=16' },
    { name: 'Burak Long', email: 'burak.long@uniliver.com', address: 'Mirpur-12', company: 'Uniliver', deliveryDate: '19 Sep 2023', amount: 1736.9, status: 'Deactive', photo: 'https://i.pravatar.cc/72?img=18' },
    { name: 'Wellness Co.', email: 'hello@wellness.co', address: '12 Market Street', company: 'Wellness Co.', deliveryDate: '30 Oct 2024', amount: 4850, status: 'Active' },
    { name: 'Derma Labs', email: 'orders@dermalabs.com', address: '88 Madison Ave', company: 'Derma Labs', deliveryDate: '02 Nov 2024', amount: 2940, status: 'Deactive' },
    { name: 'MediTech', email: 'team@meditech.com', address: '4 Innovation Park', company: 'MediTech', deliveryDate: '06 Nov 2024', amount: 1720, status: 'Active' },
];
const ordersSeed = [
    { userName: 'Sarah Wilson', email: 'sarah.wilson@email.com', address: '24 Park Avenue, New York', products: 'Vitamin C, Omega 3', orderDate: '28 Oct 2024', price: 84.5, status: 'Completed', photo: 'https://i.pravatar.cc/72?img=47' },
    { userName: 'James Anderson', email: 'james.anderson@email.com', address: '18 King Street, Toronto', products: 'Face Cream', orderDate: '27 Oct 2024', price: 24.5, status: 'Confirmed', photo: 'https://i.pravatar.cc/72?img=12' },
    { userName: 'Emily Johnson', email: 'emily.johnson@email.com', address: '7 Grove Road, London', products: 'Thermometer', orderDate: '26 Oct 2024', price: 12.75, status: 'Pending', photo: 'https://i.pravatar.cc/72?img=32' },
    { userName: 'Michael Brown', email: 'michael.brown@email.com', address: '42 Collins Street, Sydney', products: 'Hand Wash, Vitamin C', orderDate: '24 Oct 2024', price: 26.19, status: 'Processing', photo: 'https://i.pravatar.cc/72?img=15' },
    { userName: 'Olivia Martinez', email: 'olivia.martinez@email.com', address: '9 Rue Lafayette, Paris', products: 'Omega 3 Softgels', orderDate: '22 Oct 2024', price: 22, status: 'Cancelled', photo: 'https://i.pravatar.cc/72?img=5' },
    { userName: 'Daniel Lee', email: 'daniel.lee@email.com', address: '15 Oak Lane, Chicago', products: 'Digital Thermometer', orderDate: '21 Oct 2024', price: 12.75, status: 'Delivered', photo: 'https://i.pravatar.cc/72?img=8' },
    { userName: 'Sophia Rossi', email: 'sophia.rossi@email.com', address: '3 Via Roma, Milan', products: 'Hydrating Face Cream', orderDate: '19 Oct 2024', price: 24.5, status: 'Completed', photo: 'https://i.pravatar.cc/72?img=20' },
    { userName: 'Noah Patel', email: 'noah.patel@email.com', address: '88 Queen Street, Auckland', products: 'Daily Care Hand Wash', orderDate: '18 Oct 2024', price: 7.2, status: 'Pending', photo: 'https://i.pravatar.cc/72?img=33' },
];
const transactions = [
    { _id: id(), name: "Ethan's birthday gift", amount: 300, type: 'Income' },
    { _id: id(), name: 'Product Purchase', amount: 300, type: 'Expense' },
    { _id: id(), name: 'Product Purchase', amount: 300, type: 'Error' },
    { _id: id(), name: 'Monthly subscription', amount: 1200.95, type: 'Income' },
    { _id: id(), name: 'Office rent', amount: 5000, type: 'Expense' },
    { _id: id(), name: 'Pharmacy restock', amount: 840, type: 'Expense' },
];
const withProductMeta = (item, index) => ({ ...item, photo: item.photo || productPhotos[index % productPhotos.length], createdAt: new Date(Date.UTC(2024, 0, productsSeed.length - index)).toISOString() });
const memory = { customers: customersSeed.map((item, index) => ({ _id: id(), createdAt: `2024-10-${String(24 - index).padStart(2, '0')}`, ...item })), products: productsSeed.map((item, index) => ({ _id: id(), ...withProductMeta(item, index) })), suppliers: suppliersSeed.map((item, index) => ({ _id: id(), createdAt: `2024-09-${String(19 - index).padStart(2, '0')}`, ...item })), orders: ordersSeed.map((item, index) => ({ _id: id(), createdAt: `2024-10-${String(28 - index).padStart(2, '0')}`, ...item })) };
const demoUser = { id: 'admin-1', name: 'Clayton Santos', email: 'vendor@gmail.com', passwordHashes: [bcrypt.hashSync('12345678', 10), bcrypt.hashSync('claytonsantos', 10)], role: 'admin' };
const revokedTokens = new Set();
const refreshStore = new Map();
const signAccess = () => jwt.sign({ id: demoUser.id, email: demoUser.email, role: demoUser.role }, secret, { expiresIn: '15m' });
const signRefresh = () => jwt.sign({ id: demoUser.id, type: 'refresh' }, secret, { expiresIn: '7d' });
const issueTokens = () => {
    const token = signAccess();
    const refreshToken = signRefresh();
    refreshStore.set(refreshToken, demoUser.id);
    return { token, refreshToken, user: { name: demoUser.name, email: demoUser.email, role: demoUser.role } };
};
const schemas = {
    products: new mongoose.Schema({ name: { type: String, required: true, trim: true }, sku: String, photo: String, category: { type: String, enum: productCategories, required: true }, stock: { type: Number, min: 0, required: true }, suppliers: { type: String, required: true }, price: { type: Number, min: 0, required: true } }, { timestamps: true }),
    suppliers: new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: String, photo: String, address: { type: String, required: true }, company: { type: String, required: true }, deliveryDate: { type: String, required: true }, amount: { type: Number, min: 0, required: true }, status: { type: String, enum: supplierStatuses, required: true } }, { timestamps: true }),
    customers: new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, spent: { type: Number, min: 0, default: 0 }, country: String, photo: String, address: { type: String, required: true }, phone: { type: String, required: true }, registerDate: { type: String, required: true } }, { timestamps: true }),
    orders: new mongoose.Schema({ userName: { type: String, required: true }, email: String, address: { type: String, required: true }, products: { type: String, required: true }, orderDate: { type: String, required: true }, price: { type: Number, min: 0, required: true }, status: { type: String, required: true } }, { timestamps: true }),
};
const models = Object.fromEntries(Object.entries(schemas).map(([name, schema]) => [name, mongoose.models[name] || mongoose.model(name, schema)]));
let database = 'memory';

app.use(cors({ origin: true }));
app.use(express.json());
const protect = (req, res, next) => { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token || revokedTokens.has(token)) return res.status(401).json({ message: 'Authentication required' }); try { req.user = jwt.verify(token, secret); next(); } catch { return res.status(401).json({ message: 'Session expired. Please log in again.' }); } };
const validatePayload = (name, payload) => { const required = name === 'products' ? ['name', 'category', 'stock', 'suppliers', 'price'] : name === 'suppliers' ? ['name', 'address', 'company', 'deliveryDate', 'amount', 'status'] : name === 'customers' ? ['name', 'email', 'address', 'phone', 'registerDate'] : []; const missing = required.find((field) => payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === ''); if (missing) return `${missing} is required`; if (name === 'products' && !productCategories.includes(payload.category)) return 'Invalid product category'; if (name === 'suppliers' && !supplierStatuses.includes(payload.status)) return 'Invalid supplier status'; if (name === 'customers' && !/^\S+@\S+\.\S+$/.test(payload.email)) return 'Invalid email'; for (const field of ['stock', 'price', 'amount']) if (payload[field] !== undefined && (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) return `${field} must be a non-negative number`; return null; };
const queryItems = async (name, req) => { const search = String(req.query.search || '').trim(); const sortField = String(req.query.sort || 'createdAt'); const order = req.query.order === 'asc' ? 1 : -1; const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10)); const fields = name === 'orders' ? ['userName', 'email'] : name === 'products' ? ['name', 'category'] : ['name', 'email', 'company']; if (database === 'mongodb') { const filter = search ? { $or: fields.map((field) => ({ [field]: { $regex: search, $options: 'i' } })) } : {}; const [items, total] = await Promise.all([models[name].find(filter).sort({ [sortField]: order }).skip((page - 1) * limit).limit(limit).lean(), models[name].countDocuments(filter)]); return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) }; } let items = [...memory[name]]; if (search) items = items.filter((item) => fields.some((field) => String(item[field] || '').toLowerCase().includes(search.toLowerCase()))); items.sort((a, b) => String(a[sortField] || '').localeCompare(String(b[sortField] || ''), undefined, { numeric: true }) * order); return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit, pages: Math.max(1, Math.ceil(items.length / limit)) }; };
const createItem = async (name, payload) => database === 'mongodb' ? (await models[name].create(payload)).toObject() : ({ _id: id(), createdAt: new Date().toISOString(), ...payload });
const updateItem = async (name, itemId, payload) => { if (database === 'mongodb') return models[name].findByIdAndUpdate(itemId, payload, { new: true, runValidators: true }).lean(); const index = memory[name].findIndex((item) => item._id === itemId); if (index < 0) return null; memory[name][index] = { ...memory[name][index], ...payload }; return memory[name][index]; };
const deleteItem = async (name, itemId) => { if (database === 'mongodb') return models[name].findByIdAndDelete(itemId); const index = memory[name].findIndex((item) => item._id === itemId); if (index < 0) return null; return memory[name].splice(index, 1)[0]; };

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database }));
app.post('/api/user/login', async (req, res) => { const { email, password } = req.body; if (!/^\S+@\S+\.\S+$/.test(email || '') || !password) return res.status(400).json({ message: 'Valid email and password are required' }); const passwordOk = email === demoUser.email && (await Promise.all(demoUser.passwordHashes.map((hash) => bcrypt.compare(password, hash)))).some(Boolean); if (!passwordOk) return res.status(401).json({ message: 'Invalid email or password' }); res.json(issueTokens()); });
app.post('/api/user/refresh', (req, res) => { const { refreshToken } = req.body || {}; if (!refreshToken || !refreshStore.has(refreshToken)) return res.status(401).json({ message: 'Refresh token is invalid' }); try { const payload = jwt.verify(refreshToken, secret); if (payload.type !== 'refresh') return res.status(401).json({ message: 'Refresh token is invalid' }); refreshStore.delete(refreshToken); revokedTokens.add(refreshToken); res.json(issueTokens()); } catch { return res.status(401).json({ message: 'Refresh token expired' }); } });
app.get('/api/user/user-info', protect, (_req, res) => res.json({ name: demoUser.name, email: demoUser.email, role: demoUser.role }));
app.get('/api/user/logout', protect, (req, res) => { revokedTokens.add(req.headers.authorization.replace('Bearer ', '')); const refreshToken = req.headers['x-refresh-token'] || req.query.refreshToken; if (refreshToken) refreshStore.delete(refreshToken); res.json({ message: 'Logged out successfully' }); });
app.get('/api/dashboard', protect, async (_req, res) => { const counts = await Promise.all(['products', 'suppliers', 'customers'].map((name) => database === 'mongodb' ? models[name].countDocuments() : memory[name].length)); res.json({ statistics: { products: counts[0], suppliers: counts[1], customers: counts[2] }, recentCustomers: (await queryItems('customers', { query: { limit: 5, sort: 'createdAt', order: 'desc' } })).items, transactions }); });
app.get('/api/customers/:customerId', protect, async (req, res) => { const customer = database === 'mongodb' ? await models.customers.findById(req.params.customerId).lean() : memory.customers.find((item) => item._id === req.params.customerId); if (!customer) return res.status(404).json({ message: 'Customer not found' }); const history = database === 'mongodb' ? await models.orders.find({ email: customer.email }).lean() : memory.orders.filter((item) => item.email === customer.email); res.json({ customer, history }); });
for (const name of ['orders', 'products', 'suppliers', 'customers']) { app.get(`/api/${name}`, protect, async (req, res, next) => { try { const result = await queryItems(name, req); res.json({ [name]: result.items, ...(name === 'products' ? { categories: productCategories } : {}), pagination: { total: result.total, page: result.page, limit: result.limit, pages: result.pages } }); } catch (error) { next(error); } }); app.post(`/api/${name}`, protect, async (req, res, next) => { try { const validationError = validatePayload(name, req.body); if (validationError) return res.status(400).json({ message: validationError }); const item = await createItem(name, req.body); if (database === 'memory') memory[name].unshift(item); res.status(201).json(item); } catch (error) { next(error); } }); app.put(`/api/${name}/:itemId`, protect, async (req, res, next) => { try { const current = database === 'mongodb' ? await models[name].findById(req.params.itemId).lean() : memory[name].find((item) => item._id === req.params.itemId); if (!current) return res.status(404).json({ message: `${name} item not found` }); const payload = { ...current, ...req.body }; const validationError = validatePayload(name, payload); if (validationError) return res.status(400).json({ message: validationError }); res.json(await updateItem(name, req.params.itemId, req.body)); } catch (error) { next(error); } }); app.delete(`/api/${name}/:itemId`, protect, async (req, res, next) => { try { if (!await deleteItem(name, req.params.itemId)) return res.status(404).json({ message: `${name} item not found` }); res.status(204).end(); } catch (error) { next(error); } }); }
if (process.env.NODE_ENV === 'production') {
    const dist = path.join(__dirname, '../dist');
    app.use(express.static(dist, { maxAge: '7d' }));
    app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
} else {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    app.get(['/', '/home', '/dashboard', '/login', '/products', '/orders', '/customers', '/suppliers'], (req, res) => {
        res.redirect(302, `${frontendUrl}${req.path}`);
    });
}
app.use((error, _req, res, _next) => { console.error(error); res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.name === 'ValidationError' ? 'Invalid data' : 'Internal server error' }); });
const start = async () => {
    if (process.env.MONGODB_URI) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 30000 });
            database = 'mongodb';
            for (const [name, seed] of Object.entries({ customers: customersSeed, products: productsSeed, suppliers: suppliersSeed, orders: ordersSeed })) {
                if (name === 'products') {
                    const seeded = await models.products.findOne({ name: 'Aspirin', photo: { $exists: true, $ne: '' } });
                    if (!seeded) {
                        await models.products.deleteMany({});
                        await models.products.insertMany(seed.map((item, index) => withProductMeta(item, index)));
                    }
                    continue;
                }
                if (name === 'customers' && !await models.customers.findOne({ photo: { $exists: true, $ne: '' } })) {
                    await models.customers.deleteMany({});
                    await models.customers.insertMany(seed);
                    continue;
                }
                if (name === 'suppliers' && !await models.suppliers.findOne({ name: 'Alex Shatov' })) {
                    await models.suppliers.deleteMany({});
                    await models.suppliers.insertMany(seed);
                    continue;
                }
                if (await models[name].countDocuments() === 0) await models[name].insertMany(seed);
            }
            console.log('MongoDB connected');
        } catch (error) {
            console.warn(`MongoDB unavailable, using memory data: ${error.message}`);
        }
    }
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
};
start();

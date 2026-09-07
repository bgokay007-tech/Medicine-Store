import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 4000;
const secret = process.env.JWT_SECRET || 'local-development-secret';
const id = () => Math.random().toString(36).slice(2, 10);
const productCategories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];
const supplierStatuses = ['Active', 'Pending', 'Inactive'];
const customersSeed = [
    { name: 'Sarah Wilson', email: 'sarah.wilson@email.com', spent: 482.5, country: 'United States', address: '24 Park Avenue', phone: '+1 202 555 0188', registerDate: '24 Oct 2024' },
    { name: 'James Anderson', email: 'james.anderson@email.com', spent: 326.2, country: 'Canada', address: '18 King Street', phone: '+1 416 555 0124', registerDate: '20 Oct 2024' },
    { name: 'Emily Johnson', email: 'emily.johnson@email.com', spent: 214.75, country: 'United Kingdom', address: '7 Grove Road', phone: '+44 20 7946 0321', registerDate: '18 Oct 2024' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', spent: 190, country: 'Australia', address: '42 Collins Street', phone: '+61 2 5550 8010', registerDate: '12 Oct 2024' },
];
const productsSeed = [
    { name: 'Vitamin C 1000mg', sku: 'MED-2048', category: 'Vitamins & Supplements', stock: 148, suppliers: 'Wellness Co.', price: 18.99 },
    { name: 'Hydrating Face Cream', sku: 'SKN-1093', category: 'Skin Care', stock: 86, suppliers: 'Derma Labs', price: 24.5 },
    { name: 'Digital Thermometer', sku: 'MED-8871', category: 'Medicine', stock: 42, suppliers: 'MediTech', price: 12.75 },
    { name: 'Daily Care Hand Wash', sku: 'HND-3280', category: 'Hand', stock: 214, suppliers: 'Pure Life', price: 7.2 },
    { name: 'Omega 3 Softgels', sku: 'VIT-4021', category: 'Vitamins & Supplements', stock: 67, suppliers: 'Wellness Co.', price: 22 },
];
const suppliersSeed = [
    { name: 'Wellness Co.', email: 'hello@wellness.co', address: '12 Market Street', company: 'Wellness Co.', deliveryDate: '30 Oct 2024', amount: 4850, status: 'Active' },
    { name: 'Derma Labs', email: 'orders@dermalabs.com', address: '88 Madison Ave', company: 'Derma Labs', deliveryDate: '02 Nov 2024', amount: 2940, status: 'Pending' },
    { name: 'MediTech', email: 'team@meditech.com', address: '4 Innovation Park', company: 'MediTech', deliveryDate: '06 Nov 2024', amount: 1720, status: 'Active' },
];
const ordersSeed = [
    { userName: 'Sarah Wilson', email: 'sarah.wilson@email.com', address: '24 Park Avenue', products: 'Vitamin C, Omega 3', orderDate: '28 Oct 2024', price: 84.5, status: 'Delivered' },
    { userName: 'James Anderson', email: 'james.anderson@email.com', address: '18 King Street', products: 'Face Cream', orderDate: '27 Oct 2024', price: 24.5, status: 'Processing' },
    { userName: 'Emily Johnson', email: 'emily.johnson@email.com', address: '7 Grove Road', products: 'Thermometer', orderDate: '26 Oct 2024', price: 12.75, status: 'Pending' },
    { userName: 'Michael Brown', email: 'michael.brown@email.com', address: '42 Collins Street', products: 'Hand Wash, Vitamin C', orderDate: '24 Oct 2024', price: 26.19, status: 'Delivered' },
];
const transactions = [
    { _id: id(), title: 'Order #1048', email: 'sarah.wilson@email.com', amount: 84.5, type: 'income' },
    { _id: id(), title: 'Supplier payment', amount: 4200, type: 'expense' },
    { _id: id(), title: 'Order #1047', email: 'james.anderson@email.com', amount: 24.5, type: 'income' },
    { _id: id(), title: 'Delivery & logistics', amount: 680, type: 'expense' },
];
const memory = { customers: customersSeed.map((item) => ({ _id: id(), ...item })), products: productsSeed.map((item) => ({ _id: id(), ...item })), suppliers: suppliersSeed.map((item) => ({ _id: id(), ...item })), orders: ordersSeed.map((item) => ({ _id: id(), ...item })) };
const demoUser = { id: 'admin-1', name: 'Clayton Santos', email: 'vendor@gmail.com', passwordHash: bcrypt.hashSync('12345678', 10), role: 'admin' };
const revokedTokens = new Set();
const schemas = {
    products: new mongoose.Schema({ name: { type: String, required: true, trim: true }, sku: String, category: { type: String, enum: productCategories, required: true }, stock: { type: Number, min: 0, required: true }, suppliers: { type: String, required: true }, price: { type: Number, min: 0, required: true } }, { timestamps: true }),
    suppliers: new mongoose.Schema({ name: { type: String, required: true, trim: true }, email: String, address: { type: String, required: true }, company: { type: String, required: true }, deliveryDate: { type: String, required: true }, amount: { type: Number, min: 0, required: true }, status: { type: String, enum: supplierStatuses, required: true } }, { timestamps: true }),
    customers: new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true }, spent: { type: Number, min: 0, default: 0 }, country: String, address: { type: String, required: true }, phone: { type: String, required: true }, registerDate: { type: String, required: true } }, { timestamps: true }),
    orders: new mongoose.Schema({ userName: { type: String, required: true }, email: String, address: { type: String, required: true }, products: { type: String, required: true }, orderDate: { type: String, required: true }, price: { type: Number, min: 0, required: true }, status: { type: String, required: true } }, { timestamps: true }),
};
const models = Object.fromEntries(Object.entries(schemas).map(([name, schema]) => [name, mongoose.models[name] || mongoose.model(name, schema)]));
let database = 'memory';

app.use(cors({ origin: true }));
app.use(express.json());
const protect = (req, res, next) => { const token = req.headers.authorization?.replace('Bearer ', ''); if (!token || revokedTokens.has(token)) return res.status(401).json({ message: 'Authentication required' }); try { req.user = jwt.verify(token, secret); next(); } catch { return res.status(401).json({ message: 'Session expired. Please log in again.' }); } };
const validatePayload = (name, payload) => { const required = name === 'products' ? ['name', 'category', 'stock', 'suppliers', 'price'] : name === 'suppliers' ? ['name', 'address', 'company', 'deliveryDate', 'amount', 'status'] : name === 'customers' ? ['name', 'email', 'address', 'phone', 'registerDate'] : []; const missing = required.find((field) => payload[field] === undefined || payload[field] === null || String(payload[field]).trim() === ''); if (missing) return `${missing} is required`; if (name === 'products' && !productCategories.includes(payload.category)) return 'Invalid product category'; if (name === 'suppliers' && !supplierStatuses.includes(payload.status)) return 'Invalid supplier status'; if (name === 'customers' && !/^\S+@\S+\.\S+$/.test(payload.email)) return 'Invalid email'; for (const field of ['stock', 'price', 'amount']) if (payload[field] !== undefined && (!Number.isFinite(Number(payload[field])) || Number(payload[field]) < 0)) return `${field} must be a non-negative number`; return null; };
const queryItems = async (name, req) => { const search = String(req.query.search || '').trim(); const sortField = String(req.query.sort || 'createdAt'); const order = req.query.order === 'asc' ? 1 : -1; const page = Math.max(1, Number(req.query.page) || 1); const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10)); const fields = name === 'orders' ? ['userName', 'email'] : name === 'products' ? ['name', 'category'] : ['name', 'email', 'company']; if (database === 'mongodb') { const filter = search ? { $or: fields.map((field) => ({ [field]: { $regex: search, $options: 'i' } })) } : {}; const [items, total] = await Promise.all([models[name].find(filter).sort({ [sortField]: order }).skip((page - 1) * limit).limit(limit).lean(), models[name].countDocuments(filter)]); return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) }; } let items = [...memory[name]]; if (search) items = items.filter((item) => fields.some((field) => String(item[field] || '').toLowerCase().includes(search.toLowerCase()))); items.sort((a, b) => String(a[sortField] || '').localeCompare(String(b[sortField] || ''), undefined, { numeric: true }) * order); return { items: items.slice((page - 1) * limit, page * limit), total: items.length, page, limit, pages: Math.max(1, Math.ceil(items.length / limit)) }; };
const createItem = async (name, payload) => database === 'mongodb' ? (await models[name].create(payload)).toObject() : ({ _id: id(), ...payload });
const updateItem = async (name, itemId, payload) => { if (database === 'mongodb') return models[name].findByIdAndUpdate(itemId, payload, { new: true, runValidators: true }).lean(); const index = memory[name].findIndex((item) => item._id === itemId); if (index < 0) return null; memory[name][index] = { ...memory[name][index], ...payload }; return memory[name][index]; };
const deleteItem = async (name, itemId) => { if (database === 'mongodb') return models[name].findByIdAndDelete(itemId); const index = memory[name].findIndex((item) => item._id === itemId); if (index < 0) return null; return memory[name].splice(index, 1)[0]; };

app.get('/api/health', (_req, res) => res.json({ status: 'ok', database }));
app.post('/api/user/login', async (req, res) => { const { email, password } = req.body; if (!/^\S+@\S+\.\S+$/.test(email || '') || !password) return res.status(400).json({ message: 'Valid email and password are required' }); if (email !== demoUser.email || !(await bcrypt.compare(password, demoUser.passwordHash))) return res.status(401).json({ message: 'Invalid email or password' }); const token = jwt.sign({ id: demoUser.id, email: demoUser.email, role: demoUser.role }, secret, { expiresIn: '2h' }); res.json({ token, user: { name: demoUser.name, email: demoUser.email, role: demoUser.role } }); });
app.get('/api/user/user-info', protect, (_req, res) => res.json({ name: demoUser.name, email: demoUser.email, role: demoUser.role }));
app.get('/api/user/logout', protect, (req, res) => { revokedTokens.add(req.headers.authorization.replace('Bearer ', '')); res.json({ message: 'Logged out successfully' }); });
app.get('/api/dashboard', protect, async (_req, res) => { const counts = await Promise.all(['products', 'suppliers', 'customers'].map((name) => database === 'mongodb' ? models[name].countDocuments() : memory[name].length)); res.json({ statistics: { products: counts[0], suppliers: counts[1], customers: counts[2] }, recentCustomers: (await queryItems('customers', { query: { limit: 5, sort: 'createdAt', order: 'desc' } })).items, transactions }); });
app.get('/api/customers/:customerId', protect, async (req, res) => { const customer = database === 'mongodb' ? await models.customers.findById(req.params.customerId).lean() : memory.customers.find((item) => item._id === req.params.customerId); if (!customer) return res.status(404).json({ message: 'Customer not found' }); const history = database === 'mongodb' ? await models.orders.find({ email: customer.email }).lean() : memory.orders.filter((item) => item.email === customer.email); res.json({ customer, history }); });
for (const name of ['orders', 'products', 'suppliers', 'customers']) { app.get(`/api/${name}`, protect, async (req, res, next) => { try { const result = await queryItems(name, req); res.json({ [name]: result.items, pagination: { total: result.total, page: result.page, limit: result.limit, pages: result.pages } }); } catch (error) { next(error); } }); app.post(`/api/${name}`, protect, async (req, res, next) => { try { const validationError = validatePayload(name, req.body); if (validationError) return res.status(400).json({ message: validationError }); const item = await createItem(name, req.body); if (database === 'memory') memory[name].unshift(item); res.status(201).json(item); } catch (error) { next(error); } }); app.put(`/api/${name}/:itemId`, protect, async (req, res, next) => { try { const current = database === 'mongodb' ? await models[name].findById(req.params.itemId).lean() : memory[name].find((item) => item._id === req.params.itemId); if (!current) return res.status(404).json({ message: `${name} item not found` }); const payload = { ...current, ...req.body }; const validationError = validatePayload(name, payload); if (validationError) return res.status(400).json({ message: validationError }); res.json(await updateItem(name, req.params.itemId, req.body)); } catch (error) { next(error); } }); app.delete(`/api/${name}/:itemId`, protect, async (req, res, next) => { try { if (!await deleteItem(name, req.params.itemId)) return res.status(404).json({ message: `${name} item not found` }); res.status(204).end(); } catch (error) { next(error); } }); }
app.use((error, _req, res, _next) => { console.error(error); res.status(error.name === 'ValidationError' ? 400 : 500).json({ message: error.name === 'ValidationError' ? 'Invalid data' : 'Internal server error' }); });
const start = async () => { if (process.env.MONGODB_URI) { try { await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000, socketTimeoutMS: 30000 }); database = 'mongodb'; for (const [name, seed] of Object.entries({ customers: customersSeed, products: productsSeed, suppliers: suppliersSeed, orders: ordersSeed })) if (await models[name].countDocuments() === 0) await models[name].insertMany(seed); console.log('MongoDB connected'); } catch (error) { console.warn(`MongoDB unavailable, using memory data: ${error.message}`); } } app.listen(port, () => console.log(`API running on http://localhost:${port}`)); };
start();

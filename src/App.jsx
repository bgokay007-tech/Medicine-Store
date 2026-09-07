import React, { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Bell, ChevronDown, ChevronRight, CircleHelp, ClipboardList, DollarSign,
    Eye, EyeOff, LayoutDashboard, LogOut, Menu, Package, Pencil, Plus,
    Search, Settings, ShieldCheck, ShoppingBag, Store, Trash2, Truck, UserRound, ArrowLeft,
    Users, X, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const API = 'http://localhost:4000/api';
const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/orders', label: 'Orders', icon: 'orders' },
    { to: '/products', label: 'Products', icon: 'products' },
    { to: '/customers', label: 'Customers', icon: 'customers' },
    { to: '/suppliers', label: 'Suppliers', icon: 'suppliers' },
];
const productCategories = ['Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care', 'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care'];
const supplierStatuses = ['Active', 'Pending', 'Inactive'];

async function request(path, options = {}) {
    const token = localStorage.getItem('ep_token');
    const response = await fetch(`${API}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('ep_token');
            window.location.assign('/login');
        }
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

function Logo({ compact = false }) {
    const destination = localStorage.getItem('ep_token') ? '/dashboard' : '/login';
    return <NavLink to={destination} aria-label="Medicine Store home"><div className={`brand-mark ${compact ? 'brand-mark-small' : ''}`}><span>+</span></div></NavLink>;
}

function SpriteIcon({ name, size = 19 }) { return <svg width={size} height={size} aria-hidden="true" className="sprite-icon"><use href={`#icon-${name}`} /></svg>; }
function IconSprite() { return <svg className="icon-sprite-defs" aria-hidden="true"><defs><symbol id="icon-dashboard" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></symbol><symbol id="icon-orders" viewBox="0 0 24 24"><path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4" /></symbol><symbol id="icon-products" viewBox="0 0 24 24"><path d="m12 3 8 4-8 4-8-4 8-4Zm-8 9 8 4 8-4M4 16l8 4 8-4" /></symbol><symbol id="icon-customers" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M3 20c0-3 2.5-5 6-5s6 2 6 5M15 15c3 0 5 2 5 5" /></symbol><symbol id="icon-suppliers" viewBox="0 0 24 24"><path d="M3 7h11v11H3zM14 10h4l3 3v5h-7zM7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /></symbol></defs></svg>; }

function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const schema = yup.object({
        email: yup.string().email('Enter a valid email').required('Email is required'),
        password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    });
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema), defaultValues: { email: 'vendor@gmail.com', password: '12345678' } });
    const onSubmit = async (values) => {
        setServerError('');
        try {
            const data = await request('/user/login', { method: 'POST', body: JSON.stringify(values) });
            localStorage.setItem('ep_token', data.token);
            navigate('/dashboard');
        } catch (error) { setServerError(error.message); }
    };
    return <main className="login-shell">
        <section className="login-art">
            <div className="art-topline"><Logo /><span>Medicine Store</span></div>
            <div className="art-copy"><span className="eyebrow">PHARMACY OPERATIONS</span><h1>Care begins<br /><em>with clarity.</em></h1><p>A calm, intelligent workspace for your pharmacy team.</p></div>
            <div className="art-footer"><span>© 2024 Medicine Store</span><span>Admin workspace</span></div>
        </section>
        <section className="login-panel">
            <div className="login-card">
                <div className="mobile-logo"><Logo /></div>
                <span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p className="muted">Manage your pharmacy with confidence.</p>
                <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                    <label>Email address<input type="email" placeholder="vendor@gmail.com" {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
                    <label>Password<div className="password-input"><input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" {...register('password')} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{errors.password && <small>{errors.password.message}</small>}</label>
                    {serverError && <div className="form-error">{serverError}</div>}
                    <button className="primary-btn full-btn" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Log in now'}<ChevronRight size={18} /></button>
                </form>
                <div className="login-hint"><ShieldCheck size={16} /><span>Secure access for authorized team members</span></div>
            </div>
        </section>
    </main>;
}

function Shell({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const logout = async () => { try { await request('/user/logout'); } catch { } localStorage.removeItem('ep_token'); navigate('/login'); };
    return <div className="app-shell">
        <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
            <div className="sidebar-logo"><Logo /><span>Medicine Store</span><button className="close-sidebar" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
            <div className="sidebar-label">MAIN MENU</div>
            <nav>{navItems.map(({ to, label, icon }) => <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}><SpriteIcon name={icon} /><span>{label}</span>{location.pathname === to && <span className="nav-dot" />}</NavLink>)}</nav>
            <div className="sidebar-bottom"><div className="sidebar-label">PREFERENCES</div><NavLink to="/settings"><Settings size={19} /><span>Settings</span></NavLink><button className="logout-link" onClick={logout}><LogOut size={19} /><span>Log out</span></button></div>
            <div className="sidebar-help"><CircleHelp size={18} /><div><strong>Need help?</strong><span>Contact support</span></div><ChevronRight size={16} /></div>
        </aside>
        <div className="main-wrap">
            <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)}><Menu size={21} /></button><div className="breadcrumbs"><span>Medicine Store</span><ChevronRight size={15} /><strong>{navItems.find((item) => location.pathname.startsWith(item.to))?.label || 'Dashboard'}</strong></div><div className="top-actions"><button className="icon-btn notification"><Bell size={19} /><i /></button><div className={`user-menu ${userMenuOpen ? 'open' : ''}`}><div className="avatar">CS</div><div className="user-details"><strong>Clayton Santos</strong><span>vendor@gmail.com</span></div><button className="user-menu-toggle" onClick={() => setUserMenuOpen((open) => !open)} aria-label="Open user menu" aria-expanded={userMenuOpen}><ChevronDown size={16} /></button>{userMenuOpen && <div className="user-dropdown"><strong>Clayton Santos</strong><span>vendor@gmail.com</span><NavLink to="/settings" onClick={() => setUserMenuOpen(false)}><Settings size={15} /> Settings</NavLink><button onClick={logout}><LogOut size={15} /> Log out</button></div>}</div></div></header>
            <main className="page-content">{children}</main>
        </div>
    </div>;
}

function StatCard({ icon: Icon, label, value, change, tone }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-info"><span>{label}</span><strong>{value}</strong><small className={change.startsWith('+') ? 'positive' : 'negative'}>{change} <span>vs last month</span></small></div><ArrowUpRight size={17} className="stat-arrow" /></div>; }

function Dashboard() {
    const [data, setData] = useState(null);
    useEffect(() => { request('/dashboard').then(setData).catch(() => { }); }, []);
    const stats = data?.statistics || { products: 1248, suppliers: 86, customers: 2410 };
    const customers = data?.recentCustomers || [];
    const transactions = data?.transactions || [];
    const navigate = useNavigate();
    return <><PageHeading eyebrow="OVERVIEW" title="Good morning, Clayton" description="Here is what is happening with your pharmacy today." action={<button className="outline-btn" onClick={() => navigate('/activity')}><Activity size={17} /> View activity</button>} />
        <div className="stats-grid"><StatCard icon={Package} label="All products" value={stats.products.toLocaleString()} change="+12.5%" tone="mint" /><StatCard icon={Store} label="All suppliers" value={stats.suppliers} change="+4.2%" tone="lilac" /><StatCard icon={Users} label="All customers" value={stats.customers.toLocaleString()} change="+8.1%" tone="peach" /><div className="stat-card stat-revenue"><div className="stat-revenue-top"><span>Monthly revenue</span><DollarSign size={18} /></div><strong>$24,680</strong><div className="mini-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><small className="positive">+18.4% <span>vs last month</span></small></div></div>
        <div className="dashboard-grid"><section className="panel customers-panel"><PanelHeader title="Recent customers" subtitle="Your latest customer activity" link="View all" to="/customers" /><div className="table-wrap"><table><thead><tr><th>Customer</th><th>Email</th><th>Spent</th><th>Country</th></tr></thead><tbody>{customers.map((customer) => <tr key={customer._id}><td><div className="person-cell"><div className="avatar light">{customer.name.split(' ').map((part) => part[0]).join('')}</div><strong>{customer.name}</strong></div></td><td className="muted-cell">{customer.email}</td><td><strong>${customer.spent.toFixed(2)}</strong></td><td><span className="country-pill">{customer.country}</span></td></tr>)}</tbody></table></div></section><section className="panel transactions-panel"><PanelHeader title="Income & expenses" subtitle="Latest transactions" link="View all" /><div className="transaction-list">{transactions.map((transaction) => <div className="transaction" key={transaction._id}><div className={`transaction-icon ${transaction.type}`}>{transaction.type === 'income' ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />}</div><div className="transaction-main"><strong>{transaction.title}</strong><span>{transaction.email || 'Store operating expense'}</span></div><strong className={transaction.type === 'income' ? 'positive' : 'negative'}>{transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}</strong></div>)}</div></section></div>
    </>;
}

function PageHeading({ eyebrow, title, description, action }) { return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>; }
function PanelHeader({ title, subtitle, link, to }) { return <div className="panel-header"><div><h3>{title}</h3><span>{subtitle}</span></div>{link && <NavLink to={to || '#'} className="text-link">{link}<ChevronRight size={15} /></NavLink>}</div>; }

const pageConfig = { orders: { title: 'All orders', eyebrow: 'ORDERS', description: 'Review and manage every customer order.', search: 'User Name', columns: ['User info', 'Address', 'Products', 'Order date', 'Price', 'Status'] }, products: { title: 'All products', eyebrow: 'INVENTORY', description: 'Keep your catalogue accurate and healthy.', search: 'Product Name', columns: ['Product info', 'Category', 'Stock', 'Suppliers', 'Price', 'Action'] }, suppliers: { title: 'All suppliers', eyebrow: 'SUPPLY CHAIN', description: 'Manage partners and incoming deliveries.', search: 'User Name', columns: ['Supplier info', 'Address', 'Company', 'Delivery date', 'Amount', 'Status', 'Action'] }, customers: { title: 'Customers data', eyebrow: 'CUSTOMERS', description: 'Build better relationships with every customer.', search: 'User Name', columns: ['User info', 'Email', 'Address', 'Phone', 'Register date', 'Action'] } };

function DataPage({ type }) {
    const config = pageConfig[type]; const [items, setItems] = useState([]); const [query, setQuery] = useState(''); const [searched, setSearched] = useState(''); const [modal, setModal] = useState(null); const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 }); const [sort, setSort] = useState('createdAt'); const [order, setOrder] = useState('desc');
    const load = () => request(`/${type}?search=${encodeURIComponent(searched)}&page=${pagination.page}&limit=8&sort=${sort}&order=${order}`).then((data) => { setItems(data[type] || []); setPagination((current) => ({ ...current, ...(data.pagination || {}) })); }).catch(() => { });
    useEffect(() => { load(); }, [type, searched, pagination.page, sort, order]);
    const remove = async (id) => { if (!window.confirm('Delete this item?')) return; await request(`/${type}/${id}`, { method: 'DELETE' }); load(); };
    const canAdd = type === 'products' || type === 'suppliers';
    return <><PageHeading eyebrow={config.eyebrow} title={config.title} description={config.description} action={canAdd && <button className="primary-btn" onClick={() => setModal({ mode: 'add' })}><Plus size={18} /> Add a new {type === 'products' ? 'product' : 'supplier'}</button>} /><section className="panel data-panel"><div className="filter-bar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={config.search} onKeyDown={(event) => event.key === 'Enter' && (setPagination((current) => ({ ...current, page: 1 })), setSearched(query))} /></div><button className="dark-btn" onClick={() => { setPagination((current) => ({ ...current, page: 1 })); setSearched(query); }}>Filter</button><button className="filter-reset" onClick={() => { setQuery(''); setSearched(''); setPagination((current) => ({ ...current, page: 1 })); }}>Reset</button><select className="sort-select" value={`${sort}:${order}`} onChange={(event) => { const [nextSort, nextOrder] = event.target.value.split(':'); setSort(nextSort); setOrder(nextOrder); setPagination((current) => ({ ...current, page: 1 })); }}><option value="createdAt:desc">Newest first</option><option value="createdAt:asc">Oldest first</option><option value="name:asc">Name A-Z</option><option value="name:desc">Name Z-A</option></select></div><div className="table-wrap data-table"><table><thead><tr>{config.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{items.map((item) => <DataRow key={item._id} type={type} item={item} onEdit={() => setModal({ mode: 'edit', item })} onDelete={() => remove(item._id)} />)}</tbody></table>{!items.length && <div className="empty-state">No records found for this search.</div>}</div><Pagination pagination={pagination} onChange={(page) => setPagination((current) => ({ ...current, page }))} /></section>{modal && <EntityModal type={type} modal={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}</>;
}

function Pagination({ pagination, onChange }) { if (pagination.pages <= 1) return null; return <div className="pagination"><span>{pagination.total} records</span><div><button disabled={pagination.page <= 1} onClick={() => onChange(pagination.page - 1)} aria-label="Previous page"><ArrowLeft size={15} /></button>{Array.from({ length: pagination.pages }, (_, index) => index + 1).map((page) => <button key={page} className={page === pagination.page ? 'current' : ''} onClick={() => onChange(page)}>{page}</button>)}<button disabled={pagination.page >= pagination.pages} onClick={() => onChange(pagination.page + 1)} aria-label="Next page"><ChevronRight size={15} /></button></div></div>; }

function DataRow({ type, item, onEdit, onDelete }) {
    const navigate = useNavigate();
    const person = (name, sub) => { const displayName = String(name || 'Unknown'); return <div className="person-cell"><div className="avatar light">{displayName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><div><strong>{displayName}</strong><span>{sub || '-'}</span></div></div>; };
    const action = <div className="row-actions"><button onClick={(event) => { event.stopPropagation(); onEdit(); }} aria-label="Edit"><Pencil size={16} /></button>{type === 'products' && <button onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label="Delete"><Trash2 size={16} /></button>}</div>;
    if (type === 'products') return <tr><td>{person(item.name, item.sku)}</td><td><span className="tag">{item.category || '-'}</span></td><td><strong>{item.stock ?? 0}</strong><span className="sub-cell"> units</span></td><td>{item.suppliers || '-'}</td><td><strong>${Number(item.price || 0).toFixed(2)}</strong></td><td>{action}</td></tr>;
    if (type === 'orders') return <tr><td>{person(item.userName, item.email)}</td><td>{item.address || '-'}</td><td>{item.products || '-'}</td><td>{item.orderDate || '-'}</td><td><strong>${Number(item.price || 0).toFixed(2)}</strong></td><td><span className={`status ${String(item.status || 'pending').toLowerCase()}`}>{item.status || 'Pending'}</span></td></tr>;
    if (type === 'suppliers') return <tr><td>{person(item.name, item.email)}</td><td>{item.address || '-'}</td><td>{item.company || '-'}</td><td>{item.deliveryDate || '-'}</td><td><strong>${Number(item.amount || 0).toFixed(2)}</strong></td><td><span className={`status ${String(item.status || 'pending').toLowerCase()}`}>{item.status || 'Pending'}</span></td><td>{action}</td></tr>;
    return <tr onClick={() => navigate(`/customers/${item._id}`)} className="clickable-row"><td>{person(item.name, item.email)}</td><td>{item.email}</td><td>{item.address}</td><td>{item.phone}</td><td>{item.registerDate}</td><td>{action}</td></tr>;
}

function CustomerDetail() { const { customerId } = useParams(); const navigate = useNavigate(); const [data, setData] = useState(null); useEffect(() => { request(`/customers/${customerId}`).then(setData).catch(() => { }); }, [customerId]); if (!data) return <div className="empty-state">Loading customer...</div>; return <><button className="back-link" onClick={() => navigate('/customers')}><ArrowLeft size={16} /> Back to customers</button><PageHeading eyebrow="CUSTOMER PROFILE" title={data.customer.name} description={data.customer.email} /><div className="detail-grid"><section className="panel detail-card"><div className="detail-avatar">{data.customer.name.split(' ').map((part) => part[0]).join('')}</div><h3>{data.customer.name}</h3><span>{data.customer.country}</span><dl><dt>Address</dt><dd>{data.customer.address}</dd><dt>Phone</dt><dd>{data.customer.phone}</dd><dt>Register date</dt><dd>{data.customer.registerDate}</dd><dt>Total spent</dt><dd>${Number(data.customer.spent).toFixed(2)}</dd></dl></section><section className="panel detail-card"><PanelHeader title="Order history" subtitle="Previous customer transactions" /><div className="table-wrap"><table><thead><tr><th>Order</th><th>Date</th><th>Price</th><th>Status</th></tr></thead><tbody>{data.history.map((order) => <tr key={order._id}><td>{order.products}</td><td>{order.orderDate}</td><td>${Number(order.price).toFixed(2)}</td><td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td></tr>)}</tbody></table>{!data.history.length && <div className="empty-state">No order history.</div>}</div></section></div></>; }
function SimplePage({ title, description }) { return <><PageHeading eyebrow="WORKSPACE" title={title} description={description} /><section className="panel simple-page"><Activity size={28} /><h3>{title}</h3><p>This workspace is ready for your pharmacy team.</p></section></>; }

function EntityModal({ type, modal, onClose, onSaved }) {
    const isProduct = type === 'products';
    const isSupplier = type === 'suppliers';
    const item = modal.item || {};
    const fields = isProduct
        ? [['name', 'Product info'], ['category', 'Category'], ['stock', 'Stock'], ['suppliers', 'Suppliers'], ['price', 'Price']]
        : isSupplier
            ? [['name', 'Supplier info'], ['address', 'Address'], ['company', 'Company'], ['deliveryDate', 'Delivery date'], ['amount', 'Amount'], ['status', 'Status']]
            : [['name', 'User info'], ['email', 'Email'], ['address', 'Address'], ['phone', 'Phone'], ['registerDate', 'Register date']];
    const schema = yup.object(Object.fromEntries(fields.map(([name]) => [name, ['stock', 'price', 'amount'].includes(name) ? yup.number().typeError('Enter a valid number').min(0, 'Cannot be negative').required('Required') : yup.string().trim().required('Required')])));
    const defaultValues = { ...item };
    ['deliveryDate', 'registerDate'].forEach((field) => { if (defaultValues[field]) { const date = new Date(defaultValues[field]); if (!Number.isNaN(date.getTime())) defaultValues[field] = date.toISOString().slice(0, 10); } });
    const [serverError, setServerError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema), defaultValues });
    const submit = async (values) => { setServerError(''); try { const path = modal.mode === 'add' ? `/${type}` : `/${type}/${item._id}`; await request(path, { method: modal.mode === 'add' ? 'POST' : 'PUT', body: JSON.stringify(values) }); onSaved(); } catch (error) { setServerError(error.message); } };
    const title = isProduct ? 'product' : isSupplier ? 'supplier' : 'customer';
    return <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="modal"><div className="modal-header"><div><span className="eyebrow">{modal.mode === 'add' ? 'NEW ENTRY' : 'EDIT ENTRY'}</span><h2>{modal.mode === 'add' ? `Add new ${title}` : `Edit ${title}`}</h2></div><button className="icon-btn" onClick={onClose}><X size={19} /></button></div><form onSubmit={handleSubmit(submit)}><div className="modal-fields">{fields.map(([name, label]) => <label key={name}>{label}{name === 'category' ? <select {...register(name)}>{productCategories.map((category) => <option key={category}>{category}</option>)}</select> : name === 'status' ? <select {...register(name)}>{supplierStatuses.map((status) => <option key={status}>{status}</option>)}</select> : <input type={name === 'registerDate' || name === 'deliveryDate' ? 'date' : ['stock', 'price', 'amount'].includes(name) ? 'number' : 'text'} step={['price', 'amount'].includes(name) ? '0.01' : undefined} {...register(name, { valueAsNumber: ['stock', 'price', 'amount'].includes(name) })} placeholder={`Enter ${label.toLowerCase()}`} />}{errors[name] && <small className="field-error">{errors[name].message}</small>}</label>)}</div>{serverError && <div className="form-error">{serverError}</div>}<div className="modal-actions"><button type="button" className="outline-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={isSubmitting}>{modal.mode === 'add' ? 'Add' : 'Save'} changes</button></div></form></div></div>;
}

function ProtectedRoute({ children }) { return localStorage.getItem('ep_token') ? children : <Navigate to="/login" replace />; }
function App() { return <><IconSprite /><Routes><Route path="/login" element={<LoginPage />} /><Route path="/" element={<ProtectedRoute><Shell><Dashboard /></Shell></ProtectedRoute>} /><Route path="/dashboard" element={<ProtectedRoute><Shell><Dashboard /></Shell></ProtectedRoute>} />{['orders', 'products', 'customers', 'suppliers'].map((type) => <Route key={type} path={`/${type}`} element={<ProtectedRoute><Shell><DataPage type={type} /></Shell></ProtectedRoute>} />)}<Route path="/customers/:customerId" element={<ProtectedRoute><Shell><CustomerDetail /></Shell></ProtectedRoute>} /><Route path="/activity" element={<ProtectedRoute><Shell><SimplePage title="Activity" description="Review recent pharmacy activity." /></Shell></ProtectedRoute>} /><Route path="/settings" element={<ProtectedRoute><Shell><SimplePage title="Settings" description="Manage your workspace preferences." /></Shell></ProtectedRoute>} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes></>; }

export default App;

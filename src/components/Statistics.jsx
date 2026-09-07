import { NavLink } from 'react-router-dom';
import Icon from './Icon';

function StatCard({ to, icon, label, value }) {
    return (
        <NavLink to={to} className="stat-card">
            <div className="stat-top"><Icon name={icon} size={18} /><span>{label}</span></div>
            <strong>{value}</strong>
        </NavLink>
    );
}

export default function Statistics({ stats }) {
    return (
        <div className="stats-grid">
            <StatCard to="/products" icon="stats" label="All products" value={stats.products} />
            <StatCard to="/suppliers" icon="stats" label="All suppliers" value={stats.suppliers} />
            <StatCard to="/customers" icon="users" label="All Customers" value={stats.customers} />
        </div>
    );
}

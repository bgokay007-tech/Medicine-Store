import { NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../constants';
import Icon from './Icon';
import LogoutBtn from './LogoutBtn';

export default function Sidebar({ onNavigate, showLogout = false }) {
    const location = useLocation();
    return (
        <>
            <nav className="icon-nav" aria-label="Main">
                {navItems.map(({ to, label, icon }) => (
                    <NavLink key={to} to={to} title={label} aria-label={label} onClick={onNavigate} className={({ isActive }) => (isActive || (to === '/dashboard' && location.pathname === '/home')) ? 'active' : ''}>
                        <Icon name={icon} size={16} />
                    </NavLink>
                ))}
            </nav>
            {showLogout && <LogoutBtn />}
        </>
    );
}

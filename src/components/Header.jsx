import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { request } from '../api';
import Icon from './Icon';
import Logo from './Logo';
import LogoutBtn from './LogoutBtn';

const pageTitles = {
    '/home': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/orders': 'All orders',
    '/products': 'All products',
    '/suppliers': 'All suppliers',
    '/customers': 'Customers',
};

export default function Header({ onOpenMenu }) {
    const location = useLocation();
    const [user, setUser] = useState({ name: 'Clayton Santos', email: 'vendor@gmail.com' });
    useEffect(() => { request('/user/user-info').then(setUser).catch(() => { }); }, []);
    const pageTitle = pageTitles[location.pathname] || 'Dashboard';
    return (
        <header className="topbar">
            <div className="header-left">
                <button className="mobile-menu" onClick={onOpenMenu} aria-label="Open menu"><Icon name="menu" size={32} /></button>
                <Logo />
                <div className="header-title">
                    <h1>Medicine store</h1>
                    <p className="header-sub">
                        {pageTitle === 'Dashboard' ? <NavLink to="/dashboard">Dashboard</NavLink> : <span>{pageTitle}</span>}
                        <span> | {user.email || 'vendor@gmail.com'}</span>
                    </p>
                </div>
            </div>
            <LogoutBtn className="desktop-logout" />
        </header>
    );
}

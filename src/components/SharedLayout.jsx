import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Icon from './Icon';
import Sidebar from './Sidebar';

export default function SharedLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    return (
        <div className="app-shell">
            <Header onOpenMenu={() => setMobileOpen(true)} />
            {mobileOpen && (
                <div className="mobile-overlay" onMouseDown={(event) => event.target === event.currentTarget && setMobileOpen(false)}>
                    <div className="mobile-drawer">
                        <button className="close-sidebar" onClick={() => setMobileOpen(false)} aria-label="Close menu"><Icon name="close" size={18} /></button>
                        <Sidebar onNavigate={() => setMobileOpen(false)} showLogout />
                    </div>
                </div>
            )}
            <div className="main-wrap">
                <aside className="icon-rail" aria-label="Sidebar"><Sidebar /></aside>
                <main className="page-content"><Outlet /></main>
            </div>
        </div>
    );
}

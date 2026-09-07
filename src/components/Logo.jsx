import { NavLink } from 'react-router-dom';
import logo from '../assets/images/logo.svg';

export default function Logo() {
    const destination = localStorage.getItem('ep_token') ? '/home' : '/login';
    return (
        <NavLink to={destination} aria-label="Medicine store home" className="brand-link">
            <img className="brand-logo" src={logo} alt="Medicine store" width="40" height="40" />
        </NavLink>
    );
}

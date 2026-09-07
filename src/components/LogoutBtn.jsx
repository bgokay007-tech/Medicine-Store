import { useNavigate } from 'react-router-dom';
import { request } from '../api';
import Icon from './Icon';

export default function LogoutBtn({ className = '' }) {
    const navigate = useNavigate();
    const logout = async () => {
        try { await request('/user/logout'); } catch { /* session is cleared locally either way */ }
        navigate('/login');
    };
    return (
        <button type="button" className={`logout-fab ${className}`} onClick={logout} aria-label="Log out">
            <Icon name="logout" size={16} />
        </button>
    );
}

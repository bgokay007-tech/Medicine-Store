import { useNavigate } from 'react-router-dom';
import { request } from '../api';
import Icon from './Icon';

export default function LogoutBtn({ className = '' }) {
    const navigate = useNavigate();
    const logout = async () => {
        try { await request('/user/logout', { headers: { 'X-Refresh-Token': localStorage.getItem('ep_refresh') || '' } }); } catch { /* token is cleared locally either way */ }
        localStorage.removeItem('ep_token');
        localStorage.removeItem('ep_refresh');
        navigate('/login');
    };
    return (
        <button type="button" className={`logout-fab ${className}`} onClick={logout} aria-label="Log out">
            <Icon name="logout" size={16} />
        </button>
    );
}

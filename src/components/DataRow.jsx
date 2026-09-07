import { useNavigate } from 'react-router-dom';
import Ellipsis from './Ellipsis';
import Icon from './Icon';
import ProductImage from './ProductImage';

export default function DataRow({ type, item, onEdit, onDelete }) {
    const navigate = useNavigate();
    const person = (name, sub, photo) => {
        const displayName = String(name || 'Unknown');
        return (
            <div className="person-cell">
                {photo
                    ? <img className="avatar-photo" src={photo} alt="" width="36" height="36" loading="lazy" />
                    : <div className="avatar light">{displayName.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
                <div>
                    <strong><Ellipsis text={displayName} length={20} /></strong>
                    {sub && <span><Ellipsis text={sub} length={22} /></span>}
                </div>
            </div>
        );
    };
    const action = (
        <div className="fig-actions">
            <button type="button" className="fig-action-edit" onClick={(event) => { event.stopPropagation(); onEdit(); }} aria-label="Edit"><Icon name="edit" size={16} /></button>
            {type === 'products' && <button type="button" className="fig-action-delete" onClick={(event) => { event.stopPropagation(); onDelete(); }} aria-label="Delete"><Icon name="delete" size={16} /></button>}
        </div>
    );
    if (type === 'products') {
        return (
            <tr>
                <td>
                    <div className="product-info-cell">
                        <ProductImage src={item.photo} alt={item.name} />
                        <Ellipsis text={item.name} length={18} />
                    </div>
                </td>
                <td>{item.category || '-'}</td>
                <td>{String(item.stock ?? 0).padStart(2, '0')}</td>
                <td><Ellipsis text={item.suppliers} length={16} /></td>
                <td>{Number(item.price || 0).toFixed(2)}</td>
                <td>{action}</td>
            </tr>
        );
    }
    if (type === 'orders') {
        return (
            <tr>
                <td>
                    <div className="name-cell">
                        {item.photo
                            ? <img className="avatar-photo" src={item.photo} alt="" width="36" height="36" loading="lazy" />
                            : <div className="avatar light">{String(item.userName || 'U').split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
                        <span><Ellipsis text={item.userName} length={18} /></span>
                    </div>
                </td>
                <td><Ellipsis text={item.address} length={28} /></td>
                <td><Ellipsis text={item.products} length={22} /></td>
                <td>{item.orderDate || '-'}</td>
                <td>{Number(item.price || 0).toFixed(2)}</td>
                <td><span className={`status ${String(item.status || 'pending').toLowerCase()}`}>{item.status || 'Pending'}</span></td>
            </tr>
        );
    }
    if (type === 'suppliers') {
        return (
            <tr>
                <td>{person(item.name, item.email, item.photo)}</td>
                <td><Ellipsis text={item.address} length={22} /></td>
                <td><Ellipsis text={item.company} length={18} /></td>
                <td>{item.deliveryDate || '-'}</td>
                <td>{Number(item.amount || 0).toFixed(2)}</td>
                <td><span className={`status ${String(item.status || 'pending').toLowerCase()}`}>{item.status || 'Pending'}</span></td>
                <td>{action}</td>
            </tr>
        );
    }
    return (
        <tr onClick={() => navigate(`/customers/${item._id}`)} className="clickable-row">
            <td>{person(item.name, null, item.photo)}</td>
            <td><Ellipsis text={item.email} length={24} /></td>
            <td><Ellipsis text={item.address} length={22} /></td>
            <td>{item.phone}</td>
            <td>{item.registerDate}</td>
            <td>{action}</td>
        </tr>
    );
}

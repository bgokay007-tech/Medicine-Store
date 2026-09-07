import sprite from '../assets/icons/sprite.svg?url';

const aliases = {
    orders: 'shopping-cart',
    products: 'flask-fill',
    customers: 'mdi_users',
    suppliers: 'pharmacy',
    menu: 'menu-burger',
    close: 'x',
    delete: 'trash',
    stats: 'finance',
};

const filled = new Set(['dashboard', 'shopping-cart', 'flask-fill', 'pharmacy', 'mdi_users', 'logout']);

export default function Icon({ name, size = 16 }) {
    const id = aliases[name] || name;
    return (
        <svg className={`sprite-icon${filled.has(id) ? ' filled' : ''}`} width={size} height={size} aria-hidden="true">
            <use href={`${sprite}#icon-${id}`} />
        </svg>
    );
}

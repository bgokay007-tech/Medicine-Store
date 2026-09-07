export const productCategories = [
    'Medicine', 'Head', 'Hand', 'Dental Care', 'Skin Care',
    'Eye Care', 'Vitamins & Supplements', 'Orthopedic Products', 'Baby Care',
];

export const supplierStatuses = ['Active', 'Deactive'];

export const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/orders', label: 'Orders', icon: 'orders' },
    { to: '/products', label: 'Products', icon: 'products' },
    { to: '/customers', label: 'Customers', icon: 'customers' },
    { to: '/suppliers', label: 'Suppliers', icon: 'suppliers' },
];

export const pageConfig = {
    orders: { title: 'All orders', search: 'User Name', columns: ['User Info', 'Address', 'Products', 'Order date', 'Price', 'Status'] },
    products: { title: 'All products', search: 'Product Name', columns: ['Product Info', 'Category', 'Stock', 'Suppliers', 'Price', 'Action'] },
    suppliers: { title: 'All Suppliers', search: 'User Name', columns: ['Suppliers Info', 'Address', 'Company', 'Delivery date', 'Amount', 'Status', 'Action'] },
    customers: { title: 'Customers Data', search: 'User Name', columns: ['User Info', 'Email', 'Address', 'Phone', 'Register date', 'Action'] },
};

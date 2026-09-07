import { productCategories } from '../constants';

const productPhotos = [
    'https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg',
    'https://i.ibb.co/Hg0zZkQ/shop-4-7-1000x1000-min.jpg',
    'https://i.ibb.co/02WmJdc/5-19-1000x1000-min.jpg',
    'https://i.ibb.co/GxTVSVk/shop-4-9-1000x1000-min.jpg',
    'https://i.ibb.co/X330FTj/shop-4-10-1000x1000-min.jpg',
];

export const customersSeed = [
    { name: 'Sarah Wilson', email: 'sarah.wilson@email.com', spent: 482.5, country: 'United States', address: '24 Park Avenue', phone: '+1 202 555 0188', registerDate: '24 Oct 2024', photo: 'https://i.pravatar.cc/72?img=47' },
    { name: 'James Anderson', email: 'james.anderson@email.com', spent: 326.2, country: 'Canada', address: '18 King Street', phone: '+1 416 555 0124', registerDate: '20 Oct 2024', photo: 'https://i.pravatar.cc/72?img=12' },
    { name: 'Emily Johnson', email: 'emily.johnson@email.com', spent: 214.75, country: 'United Kingdom', address: '7 Grove Road', phone: '+44 20 7946 0321', registerDate: '18 Oct 2024', photo: 'https://i.pravatar.cc/72?img=32' },
    { name: 'Michael Brown', email: 'michael.brown@email.com', spent: 190, country: 'Australia', address: '42 Collins Street', phone: '+61 2 5550 8010', registerDate: '12 Oct 2024', photo: 'https://i.pravatar.cc/72?img=15' },
    { name: 'Olivia Martinez', email: 'olivia.martinez@email.com', spent: 168, country: 'France', address: '9 Rue Lafayette', phone: '+33 1 5555 0190', registerDate: '10 Oct 2024', photo: 'https://i.pravatar.cc/72?img=5' },
    { name: 'Daniel Lee', email: 'daniel.lee@email.com', spent: 142.4, country: 'United States', address: '15 Oak Lane', phone: '+1 312 555 0144', registerDate: '08 Oct 2024', photo: 'https://i.pravatar.cc/72?img=8' },
    { name: 'Sophia Rossi', email: 'sophia.rossi@email.com', spent: 126, country: 'Italy', address: '3 Via Roma', phone: '+39 02 555 0177', registerDate: '05 Oct 2024', photo: 'https://i.pravatar.cc/72?img=20' },
    { name: 'Noah Patel', email: 'noah.patel@email.com', spent: 98.2, country: 'New Zealand', address: '88 Queen Street', phone: '+64 9 555 0110', registerDate: '02 Oct 2024', photo: 'https://i.pravatar.cc/72?img=33' },
    { name: 'Liam Chen', email: 'liam.chen@email.com', spent: 76.5, country: 'Singapore', address: '21 Orchard Road', phone: '+65 6555 0188', registerDate: '28 Sep 2024', photo: 'https://i.pravatar.cc/72?img=11' },
    { name: 'Ava Kim', email: 'ava.kim@email.com', spent: 54, country: 'South Korea', address: '10 Gangnam-daero', phone: '+82 2 555 0133', registerDate: '22 Sep 2024', photo: 'https://i.pravatar.cc/72?img=9' },
];

export const productsSeed = [
    { name: 'Aspirin', category: 'Medicine', stock: 12, suppliers: 'Square', price: 89.66 },
    { name: 'Paracetamol', category: 'Medicine', stock: 19, suppliers: 'Acme', price: 34.16 },
    { name: 'Ibuprofen', category: 'Head', stock: 9, suppliers: 'Beximco', price: 53.76 },
    { name: 'Acetaminophen', category: 'Hand', stock: 14, suppliers: 'ACI', price: 28.57 },
    { name: 'Naproxen', category: 'Orthopedic Products', stock: 10, suppliers: 'Uniliver', price: 56.34 },
    { name: 'Amoxicillin', category: 'Medicine', stock: 25, suppliers: 'Square', price: 45.99 },
    { name: 'Lisinopril', category: 'Medicine', stock: 17, suppliers: 'Acme', price: 29.88 },
    { name: 'Ciprofloxacin', category: 'Head', stock: 11, suppliers: 'Beximco', price: 38.45 },
    { name: 'Hydrochlorothiazide', category: 'Hand', stock: 22, suppliers: 'ACI', price: 24.76 },
    { name: 'Prednisone', category: 'Orthopedic Products', stock: 15, suppliers: 'Uniliver', price: 48.99 },
    { name: 'Propranolol', category: 'Medicine', stock: 18, suppliers: 'Square', price: 35.66 },
    { name: 'Omeprazole', category: 'Medicine', stock: 14, suppliers: 'Acme', price: 42.16 },
    { name: 'Diazepam', category: 'Head', stock: 8, suppliers: 'Beximco', price: 27.76 },
    { name: 'Simvastatin', category: 'Hand', stock: 30, suppliers: 'ACI', price: 18.57 },
    { name: 'Tramadol', category: 'Orthopedic Products', stock: 13, suppliers: 'Uniliver', price: 52.34 },
    { name: 'Losartan', category: 'Medicine', stock: 20, suppliers: 'Square', price: 31.99 },
    { name: 'Metformin', category: 'Medicine', stock: 12, suppliers: 'Acme', price: 22.88 },
    { name: 'Alprazolam', category: 'Head', stock: 9, suppliers: 'Beximco', price: 47.76 },
    { name: 'Atorvastatin', category: 'Hand', stock: 18, suppliers: 'ACI', price: 19.57 },
    { name: 'Zolpidem', category: 'Orthopedic Products', stock: 16, suppliers: 'Uniliver', price: 41.34 },
    { name: 'Folic Acid', category: 'Vitamins & Supplements', stock: 14, suppliers: 'Square', price: 15.66 },
    { name: 'Calcium Carbonate', category: 'Vitamins & Supplements', stock: 21, suppliers: 'Acme', price: 18.16 },
    { name: 'Vitamin D', category: 'Vitamins & Supplements', stock: 16, suppliers: 'Beximco', price: 12.76 },
    { name: 'Fish Oil', category: 'Vitamins & Supplements', stock: 25, suppliers: 'ACI', price: 23.57 },
    { name: 'Multivitamins', category: 'Vitamins & Supplements', stock: 19, suppliers: 'Uniliver', price: 17.34 },
    { name: 'Toothpaste', category: 'Dental Care', stock: 30, suppliers: 'Square', price: 6.66 },
    { name: 'Mouthwash', category: 'Dental Care', stock: 25, suppliers: 'Acme', price: 8.16 },
    { name: 'Toothbrush', category: 'Dental Care', stock: 20, suppliers: 'Beximco', price: 4.76 },
    { name: 'Facial Cleanser', category: 'Skin Care', stock: 14, suppliers: 'ACI', price: 11.57 },
    { name: 'Moisturizer', category: 'Skin Care', stock: 18, suppliers: 'Uniliver', price: 13.34 },
].map((item, index) => ({
    ...item,
    photo: productPhotos[index % productPhotos.length],
}));

export const suppliersSeed = [
    { name: 'Alex Shatov', email: 'alex.shatov@square.com', address: 'Mirpur-1', company: 'Square', deliveryDate: '19 Sep 2023', amount: 6952.53, status: 'Active', photo: 'https://i.pravatar.cc/72?img=3' },
    { name: 'Philip Harbach', email: 'philip.harbach@acme.com', address: 'Dhanmondi', company: 'Acme', deliveryDate: '19 Sep 2023', amount: 8527.58, status: 'Active', photo: 'https://i.pravatar.cc/72?img=13' },
    { name: 'Mirko Fisuk', email: 'mirko.fisuk@beximco.com', address: 'Uttara-6', company: 'Beximco', deliveryDate: '19 Sep 2023', amount: 2698.5, status: 'Active', photo: 'https://i.pravatar.cc/72?img=14' },
    { name: 'Olga Semklo', email: 'olga.semklo@aci.com', address: 'Gulshan-1', company: 'ACI', deliveryDate: '19 Sep 2023', amount: 9852.64, status: 'Active', photo: 'https://i.pravatar.cc/72?img=16' },
    { name: 'Burak Long', email: 'burak.long@uniliver.com', address: 'Mirpur-12', company: 'Uniliver', deliveryDate: '19 Sep 2023', amount: 1736.9, status: 'Deactive', photo: 'https://i.pravatar.cc/72?img=18' },
    { name: 'Wellness Co.', email: 'hello@wellness.co', address: '12 Market Street', company: 'Wellness Co.', deliveryDate: '30 Oct 2024', amount: 4850, status: 'Active' },
    { name: 'Derma Labs', email: 'orders@dermalabs.com', address: '88 Madison Ave', company: 'Derma Labs', deliveryDate: '02 Nov 2024', amount: 2940, status: 'Deactive' },
    { name: 'MediTech', email: 'team@meditech.com', address: '4 Innovation Park', company: 'MediTech', deliveryDate: '06 Nov 2024', amount: 1720, status: 'Active' },
];

export const ordersSeed = [
    { userName: 'Sarah Wilson', email: 'sarah.wilson@email.com', address: '24 Park Avenue, New York', products: 'Vitamin C, Omega 3', orderDate: '28 Oct 2024', price: 84.5, status: 'Completed', photo: 'https://i.pravatar.cc/72?img=47' },
    { userName: 'James Anderson', email: 'james.anderson@email.com', address: '18 King Street, Toronto', products: 'Face Cream', orderDate: '27 Oct 2024', price: 24.5, status: 'Confirmed', photo: 'https://i.pravatar.cc/72?img=12' },
    { userName: 'Emily Johnson', email: 'emily.johnson@email.com', address: '7 Grove Road, London', products: 'Thermometer', orderDate: '26 Oct 2024', price: 12.75, status: 'Pending', photo: 'https://i.pravatar.cc/72?img=32' },
    { userName: 'Michael Brown', email: 'michael.brown@email.com', address: '42 Collins Street, Sydney', products: 'Hand Wash, Vitamin C', orderDate: '24 Oct 2024', price: 26.19, status: 'Processing', photo: 'https://i.pravatar.cc/72?img=15' },
    { userName: 'Olivia Martinez', email: 'olivia.martinez@email.com', address: '9 Rue Lafayette, Paris', products: 'Omega 3 Softgels', orderDate: '22 Oct 2024', price: 22, status: 'Cancelled', photo: 'https://i.pravatar.cc/72?img=5' },
    { userName: 'Daniel Lee', email: 'daniel.lee@email.com', address: '15 Oak Lane, Chicago', products: 'Digital Thermometer', orderDate: '21 Oct 2024', price: 12.75, status: 'Delivered', photo: 'https://i.pravatar.cc/72?img=8' },
    { userName: 'Sophia Rossi', email: 'sophia.rossi@email.com', address: '3 Via Roma, Milan', products: 'Hydrating Face Cream', orderDate: '19 Oct 2024', price: 24.5, status: 'Completed', photo: 'https://i.pravatar.cc/72?img=20' },
    { userName: 'Noah Patel', email: 'noah.patel@email.com', address: '88 Queen Street, Auckland', products: 'Daily Care Hand Wash', orderDate: '18 Oct 2024', price: 7.2, status: 'Pending', photo: 'https://i.pravatar.cc/72?img=33' },
];

export const transactionsSeed = [
    { name: "Ethan's birthday gift", amount: 300, type: 'Income' },
    { name: 'Product Purchase', amount: 300, type: 'Expense' },
    { name: 'Product Purchase', amount: 300, type: 'Error' },
    { name: 'Monthly subscription', amount: 1200.95, type: 'Income' },
    { name: 'Office rent', amount: 5000, type: 'Expense' },
    { name: 'Pharmacy restock', amount: 840, type: 'Expense' },
];

export { productCategories };

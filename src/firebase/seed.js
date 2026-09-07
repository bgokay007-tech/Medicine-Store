import { addDoc, collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './app';
import { customersSeed, ordersSeed, productsSeed, suppliersSeed, transactionsSeed } from './seedData';

const collections = {
    products: productsSeed,
    suppliers: suppliersSeed,
    customers: customersSeed,
    orders: ordersSeed,
    transactions: transactionsSeed,
};

export async function ensureSeeded() {
    const flag = await getDoc(doc(db, 'meta', 'seed'));
    if (flag.exists()) return;

    const existing = await getDocs(collection(db, 'products'));
    if (existing.empty) {
        await Promise.all(Object.entries(collections).flatMap(([name, rows]) => (
            rows.map((row, index) => addDoc(collection(db, name), {
                ...row,
                createdAt: new Date(Date.UTC(2024, 8, 28 - index)).toISOString(),
            }))
        )));
    }

    await setDoc(doc(db, 'meta', 'seed'), { seededAt: new Date().toISOString() });
}

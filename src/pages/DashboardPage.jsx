import { useEffect, useState } from 'react';
import { request } from '../api';
import IncomeExpenses from '../components/IncomeExpenses';
import RecentCustomers from '../components/RecentCustomers';
import Statistics from '../components/Statistics';

export default function DashboardPage() {
    const [data, setData] = useState(null);
    useEffect(() => { request('/dashboard').then(setData).catch(() => { }); }, []);
    const stats = data?.statistics || { products: 0, suppliers: 0, customers: 0 };
    return (
        <>
            <Statistics stats={stats} />
            <div className="dashboard-grid">
                <RecentCustomers customers={data?.recentCustomers || []} />
                <IncomeExpenses transactions={data?.transactions || []} />
            </div>
        </>
    );
}

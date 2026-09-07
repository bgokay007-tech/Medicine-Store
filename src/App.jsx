import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SharedLayout from './components/SharedLayout';
import AllOrdersPage from './pages/AllOrdersPage';
import AllProductsPage from './pages/AllProductsPage';
import AllSuppliersPage from './pages/AllSuppliersPage';
import CustomerDetail from './pages/CustomerDetail';
import CustomersDataPage from './pages/CustomersDataPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><SharedLayout /></ProtectedRoute>}>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/orders" element={<AllOrdersPage />} />
                <Route path="/products" element={<AllProductsPage />} />
                <Route path="/suppliers" element={<AllSuppliersPage />} />
                <Route path="/customers" element={<CustomersDataPage />} />
                <Route path="/customers/:customerId" element={<CustomerDetail />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
}

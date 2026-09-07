import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '../api';
import Icon from '../components/Icon';

export default function CustomerDetail() {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    useEffect(() => { request(`/customers/${customerId}`).then(setData).catch(() => { }); }, [customerId]);
    if (!data) return <div className="empty-state">Loading customer...</div>;
    return (
        <>
            <button className="back-link" onClick={() => navigate('/customers')}><Icon name="back" size={16} /> Back to customers</button>
            <div className="page-heading">
                <div>
                    <span className="eyebrow">CUSTOMER PROFILE</span>
                    <h1>{data.customer.name}</h1>
                    <p>{data.customer.email}</p>
                </div>
            </div>
            <div className="detail-grid">
                <section className="panel detail-card">
                    <div className="detail-avatar">{data.customer.name.split(' ').map((part) => part[0]).join('')}</div>
                    <h3>{data.customer.name}</h3>
                    <span>{data.customer.country}</span>
                    <dl>
                        <dt>Address</dt><dd>{data.customer.address}</dd>
                        <dt>Phone</dt><dd>{data.customer.phone}</dd>
                        <dt>Register date</dt><dd>{data.customer.registerDate}</dd>
                        <dt>Total spent</dt><dd>${Number(data.customer.spent).toFixed(2)}</dd>
                    </dl>
                </section>
                <section className="panel detail-card">
                    <div className="panel-header"><div><h3>Order history</h3><span>Previous customer transactions</span></div></div>
                    <div className="table-wrap">
                        <table>
                            <thead><tr><th>Order</th><th>Date</th><th>Price</th><th>Status</th></tr></thead>
                            <tbody>
                                {data.history.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.products}</td>
                                        <td>{order.orderDate}</td>
                                        <td>${Number(order.price).toFixed(2)}</td>
                                        <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {!data.history.length && <div className="empty-state">No order history.</div>}
                    </div>
                </section>
            </div>
        </>
    );
}

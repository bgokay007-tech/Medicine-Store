import Ellipsis from './Ellipsis';

export default function RecentCustomers({ customers }) {
    return (
        <section className="fig-table customers-panel">
            <table>
                <caption>Recent Customers</caption>
                <thead><tr><th>Name</th><th>Email</th><th>Spent</th></tr></thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer._id}>
                            <td>
                                <div className="name-cell">
                                    {customer.photo
                                        ? <img className="avatar-photo" src={customer.photo} alt="" width="36" height="36" loading="lazy" />
                                        : <div className="avatar light">{customer.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>}
                                    <span><Ellipsis text={customer.name} length={18} /></span>
                                </div>
                            </td>
                            <td><Ellipsis text={customer.email} length={24} /></td>
                            <td>{Number(customer.spent).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

import Ellipsis from './Ellipsis';

export default function IncomeExpenses({ transactions }) {
    return (
        <section className="fig-table transactions-panel">
            <table>
                <caption>Income/Expenses</caption>
                <thead>
                    <tr>
                        <th>Today</th>
                        <th />
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => {
                        const kind = String(transaction.type || 'Income');
                        const tone = kind.toLowerCase();
                        const amount = Number(transaction.amount || 0).toFixed(2);
                        const signed = tone === 'expense' ? `-${amount}` : amount;
                        return (
                            <tr key={transaction._id}>
                                <td><span className={`type-pill ${tone}`}>{kind}</span></td>
                                <td><Ellipsis text={transaction.name || transaction.title || '-'} length={22} /></td>
                                <td className={tone}>{signed}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </section>
    );
}

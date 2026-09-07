import { useEffect, useState } from 'react';
import { request } from '../api';
import { pageConfig } from '../constants';
import DataRow from './DataRow';
import EntityModal from './EntityModal';
import Icon from './Icon';
import NameFilter from './NameFilter';
import Pagination from './Pagination';

export default function DataPage({ type }) {
    const config = pageConfig[type];
    const canAdd = type === 'products' || type === 'suppliers';
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState('');
    const [modal, setModal] = useState(null);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const load = () => request(`/${type}?search=${encodeURIComponent(searched)}&page=${pagination.page}&limit=5&sort=createdAt&order=desc`)
        .then((data) => { setItems(data[type] || []); setPagination((current) => ({ ...current, ...(data.pagination || {}) })); })
        .catch(() => { });
    useEffect(() => { load(); }, [type, searched, pagination.page]);
    const applyFilter = () => { setPagination((current) => ({ ...current, page: 1 })); setSearched(query); };
    const resetFilter = () => { setQuery(''); setSearched(''); setPagination((current) => ({ ...current, page: 1 })); };
    const remove = async (id) => { if (!window.confirm('Delete this item?')) return; await request(`/${type}/${id}`, { method: 'DELETE' }); load(); };
    return (
        <div className="fig-data">
            <div className="fig-toolbar">
                <NameFilter value={query} onChange={setQuery} onSubmit={applyFilter} onClear={resetFilter} placeholder={config.search} active={Boolean(searched)} />
                {canAdd && (
                    <button type="button" className="fig-add-btn" onClick={() => setModal({ mode: 'add' })}>
                        <span className="fig-add-icon"><Icon name="plus" size={16} /></span>
                        <span>Add a new {type === 'products' ? 'product' : 'supplier'}</span>
                    </button>
                )}
            </div>
            <section className={`fig-table ${type}-table`}>
                <table>
                    <caption>{config.title}</caption>
                    <thead><tr>{config.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
                    <tbody>{items.map((item) => <DataRow key={item._id} type={type} item={item} onEdit={() => setModal({ mode: 'edit', item })} onDelete={() => remove(item._id)} />)}</tbody>
                </table>
                {!items.length && <div className="empty-state">No records found for this search.</div>}
            </section>
            <Pagination pagination={pagination} onChange={(page) => setPagination((current) => ({ ...current, page }))} />
            {modal && <EntityModal type={type} modal={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}
        </div>
    );
}

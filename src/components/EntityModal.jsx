import { createPortal } from 'react-dom';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { request } from '../api';
import { productCategories, supplierStatuses } from '../constants';
import Icon from './Icon';

export default function EntityModal({ type, modal, onClose, onSaved }) {
    const isProduct = type === 'products';
    const isSupplier = type === 'suppliers';
    const item = modal.item || {};
    const fields = isProduct
        ? [['name', 'Product Info'], ['category', 'Category'], ['suppliers', 'Suppliers'], ['stock', 'Stock'], ['price', 'Price']]
        : isSupplier
            ? [['name', 'Suppliers Info'], ['address', 'Address'], ['company', 'Company'], ['deliveryDate', 'Delivery date'], ['amount', 'Amount'], ['status', 'Status']]
            : [['name', 'User Info'], ['email', 'Email'], ['address', 'Address'], ['phone', 'Phone'], ['registerDate', 'Register date']];
    const schema = yup.object(Object.fromEntries(fields.map(([name]) => [name, ['stock', 'price', 'amount'].includes(name) ? yup.number().typeError('Enter a valid number').min(0, 'Cannot be negative').required('Required') : yup.string().trim().required('Required')])));
    const defaultValues = { ...item };
    ['deliveryDate', 'registerDate'].forEach((field) => {
        if (defaultValues[field]) {
            const parsed = dayjs(defaultValues[field]);
            if (parsed.isValid()) defaultValues[field] = parsed.format('YYYY-MM-DD');
        }
    });
    const [serverError, setServerError] = useState('');
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema), defaultValues });
    const submit = async (values) => {
        setServerError('');
        try {
            const payload = { ...values };
            if (payload.deliveryDate) payload.deliveryDate = dayjs(payload.deliveryDate).format('MMMM D, YYYY');
            if (payload.registerDate) payload.registerDate = dayjs(payload.registerDate).format('DD MMM YYYY');
            const path = modal.mode === 'add' ? `/${type}` : `/${type}/${item._id}`;
            await request(path, { method: modal.mode === 'add' ? 'POST' : 'PUT', body: JSON.stringify(payload) });
            onSaved();
        } catch (error) { setServerError(error.message); }
    };
    const title = modal.mode === 'add'
        ? (isProduct ? 'Add a new product' : isSupplier ? 'Add a new suppliers' : 'Add a new customer')
        : 'Edit data';
    return createPortal(
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
            <div className="fig-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                <button type="button" className="fig-modal-close" onClick={onClose} aria-label="Close"><Icon name="close" size={16} /></button>
                <h2 id="modal-title">{title}</h2>
                <form onSubmit={handleSubmit(submit)}>
                    <div className="fig-modal-fields">
                        {fields.map(([name, label]) => (
                            <label key={name}>
                                <span className="sr-only">{label}</span>
                                {name === 'category' ? (
                                    <select {...register(name)} defaultValue={item.category || ''}>
                                        <option value="" disabled>Category</option>
                                        {productCategories.map((category) => <option key={category}>{category}</option>)}
                                    </select>
                                ) : name === 'status' ? (
                                    <select {...register(name)} defaultValue={item.status || ''}>
                                        <option value="" disabled>Status</option>
                                        {supplierStatuses.map((status) => <option key={status}>{status}</option>)}
                                    </select>
                                ) : name === 'deliveryDate' || name === 'registerDate' ? (
                                    <Controller
                                        name={name}
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(value) => field.onChange(value ? value.format('YYYY-MM-DD') : '')}
                                                format="MMMM D, YYYY"
                                                slotProps={{ textField: { size: 'small', fullWidth: true, placeholder: label } }}
                                            />
                                        )}
                                    />
                                ) : (
                                    <input type={['stock', 'price', 'amount'].includes(name) ? 'number' : 'text'} step={['price', 'amount'].includes(name) ? '0.01' : undefined} {...register(name, { valueAsNumber: ['stock', 'price', 'amount'].includes(name) })} placeholder={label} />
                                )}
                                {errors[name] && <small className="field-error">{errors[name].message}</small>}
                            </label>
                        ))}
                    </div>
                    {serverError && <div className="form-error">{serverError}</div>}
                    <div className="fig-modal-actions">
                        <button className="fig-modal-add" disabled={isSubmitting}>{modal.mode === 'add' ? 'Add' : 'Save'}</button>
                        <button type="button" className="fig-modal-cancel" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}

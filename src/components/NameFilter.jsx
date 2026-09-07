import Icon from './Icon';

export default function NameFilter({ value, onChange, onSubmit, onClear, placeholder, active }) {
    return (
        <form className="fig-filter" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <label className="fig-search">
                <span className="sr-only">{placeholder}</span>
                <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
                {active && <button type="button" className="fig-search-clear" onClick={onClear} aria-label="Clear filter"><Icon name="close" size={14} /></button>}
            </label>
            <button type="submit" className="fig-filter-btn"><Icon name="filter" size={14} /> Filter</button>
        </form>
    );
}

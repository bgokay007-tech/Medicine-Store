export default function Pagination({ pagination, onChange }) {
    if (!pagination || pagination.pages <= 1) return null;
    const pages = Array.from({ length: pagination.pages }, (_, index) => index + 1);
    return (
        <div className={`dot-pagination${pagination.pages > 15 ? ' compact' : ''}`}>
            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    className={page === pagination.page ? 'current' : ''}
                    onClick={() => onChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={page === pagination.page ? 'page' : undefined}
                />
            ))}
        </div>
    );
}

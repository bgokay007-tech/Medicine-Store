import EllipsisText from 'react-ellipsis-text';

export default function Ellipsis({ text, length = 22 }) {
    const value = String(text || '-');
    if (typeof EllipsisText === 'function') {
        return <EllipsisText text={value} length={length} />;
    }
    return <span title={value}>{value.length > length ? `${value.slice(0, length)}...` : value}</span>;
}

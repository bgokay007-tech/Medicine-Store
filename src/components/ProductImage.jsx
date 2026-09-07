export default function ProductImage({ src, alt, size = 36 }) {
    if (!src) {
        return <div className="avatar light">{String(alt || 'P').slice(0, 1)}</div>;
    }
    return (
        <img
            className="product-photo"
            src={src}
            srcSet={`${src} 1x, ${src} 2x`}
            sizes={`${size}px`}
            width={size}
            height={size}
            alt={alt || ''}
            loading="lazy"
            decoding="async"
        />
    );
}

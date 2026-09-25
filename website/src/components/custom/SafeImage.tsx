import placeholder from '../../assets/place holder/place.svg';

/**
 * Drop-in replacement for <img> that falls back to place.svg when the src
 * is empty/null/undefined or the network load fails.
 */
export function SafeImage({
  src,
  alt = '',
  fallback = placeholder,
  className = '',
  style,
  loading,
  draggable,
  onError: externalOnError,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.currentTarget as HTMLImageElement).src = fallback;
    externalOnError?.(e);
  };

  return (
    <img
      src={src || fallback}
      alt={alt}
      loading={loading}
      draggable={draggable}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  );
}

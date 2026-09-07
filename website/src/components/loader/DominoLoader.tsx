import "./Domino.css";

/**
 * DominoLoader
 * React port of the original "toppling domino" bar animation. Bar count
 * is now a prop — each <li> gets a --i index and the shared --bar-count
 * is set once on the <ul>, and the CSS spaces out each bar's phase
 * automatically (see domino-loader.css).
 */

type DominoLoaderProps = {
  className?: string;
  barColor?: string;
  barCount?: number;
};

const DominoLoader = ({
  className = "",
  barColor,
  barCount = 10,
}: DominoLoaderProps) => {
  return (
    <ul
      role="progressbar"
      aria-busy="true"
      aria-label="Loading"
      className={`domino-loader ${className}`}
      style={
        {
          ...(barColor ? { "--bar-colour": barColor } : {}),
          "--bar-count": barCount,
        } as React.CSSProperties
      }
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <li
          key={i}
          role="presentation"
          style={{ ["--i" as string]: i } as React.CSSProperties}
        />
      ))}
    </ul>
  );
};

export default DominoLoader;
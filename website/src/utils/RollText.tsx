interface RollTextProps {
  text: string;
  stagger?: number; 
  className?: string;
}

const roll = "block transition-transform duration-300 ease-out group-hover:-translate-y-full";

const RollText = ({ text, stagger = 30, className = "" }: RollTextProps) => (
  <span className={`flex whitespace-pre ${className}`}>
    {text.split("").map((char, i) => {
      const delay = { transitionDelay: `${i * stagger}ms` };
      return (
        <span key={i} className="relative block overflow-hidden">
          <span className={roll} style={delay}>{char}</span>
          <span className={`${roll} absolute left-0 top-full`} style={delay}>{char}</span>
        </span>
      );
    })}
  </span>
);

export default RollText;
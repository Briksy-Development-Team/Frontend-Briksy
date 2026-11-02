import BuilderListCardSkeleton from "./BuilderListCardSkeleton";

// Trader and Builder cards share the identical card layout per Figma 4667-2373
export default function TraderListCardSkeleton(props: {
  count?: number;
  className?: string;
}) {
  return <BuilderListCardSkeleton {...props} />;
}

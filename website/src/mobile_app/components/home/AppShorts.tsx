import ShortsSection from "../../../components/shorts/ShortsSection";
import type { ShortItem, ShortComment } from "../../../components/shorts/types";

export type { ShortItem, ShortComment };
export { DEFAULT_SHORTS } from "../../../components/shorts/types";

interface AppShortsProps {
  title?: string;
  items?: ShortItem[];
  seeAllPath?: string;
  isLoading?: boolean;
}

export default function AppShorts(props: AppShortsProps) {
  return <ShortsSection {...props} variant="pwa" />;
}

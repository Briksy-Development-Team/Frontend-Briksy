import type { ResultType } from "../../types/search";
import ResultsSkeleton from "../../components/skeletons/ResultsSkeleton";

export default function ResultsLoadingSkeleton({ resultType }: { resultType?: ResultType }) {
  return <ResultsSkeleton count={8} showHeader={Boolean(resultType)} />;
}

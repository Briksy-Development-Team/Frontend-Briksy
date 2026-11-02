import BuilderListCard, { type OrganizationCardItem } from "../builder/BuilderListCard";
import type { Trader } from "../../../types/trader";

type Props = {
  item: Trader;
};

const TraderListCard = ({ item }: Props) => (
  <BuilderListCard item={item as OrganizationCardItem} />
);

export default TraderListCard;

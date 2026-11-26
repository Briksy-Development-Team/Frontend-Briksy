import type { QueryParams } from "../../types";

export type SummaryCardItem = {
  id: string;
  label: string;
  count: number | string;
  subtitle?: string;
  dotColor?: string;
  active?: boolean;
  filterKey?: string;
  filterValue?: unknown;
  onClick?: () => void;
};

type Props = {
  cards: SummaryCardItem[];
  params: QueryParams;
  onParamsChange: (params: QueryParams) => void;
};

export function SummaryFilters({ cards, params, onParamsChange }: Props) {
  const apply = (card: SummaryCardItem) => {
    if (card.onClick) return card.onClick();
    if (!card.filterKey) return;
    const filters = { ...params.filters };
    if (card.filterValue === undefined) delete filters[card.filterKey];
    else filters[card.filterKey] = card.filterValue;
    onParamsChange({ ...params, filters, page: 1 });
  };

  return (
    <div className="briksy-summary-grid">
      {cards.map((card) => {
        const content = (
          <>
            <span className="briksy-card-label-row">
              <span className="briksy-dot" style={{ backgroundColor: card.dotColor ?? "#342511" }} />
              <span className="briksy-card-label">{card.label}</span>
            </span>
            <span className="briksy-card-count">{card.count}</span>
            {card.subtitle && <span className="briksy-card-subtitle">{card.subtitle}</span>}
          </>
        );
        const className = `briksy-summary-card${card.active ? " briksy-summary-card--active" : ""}`;
        return card.filterKey || card.onClick
          ? <button key={card.id} type="button" className={className} aria-pressed={Boolean(card.active)} onClick={() => apply(card)}>{content}</button>
          : <div key={card.id} className={className}>{content}</div>;
      })}
    </div>
  );
}

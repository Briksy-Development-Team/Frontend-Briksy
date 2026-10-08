export type PropertyPricing = {
  pricing_type?: "fixed" | "estimated" | null;
  price?: number | null;
  price_min?: number | null;
  price_max?: number | null;
};

export const formatPropertyPrice = (property: PropertyPricing): string => {
  const format = (value: number | null | undefined) => value == null ? "" : `$${value.toLocaleString("en-AU", { maximumFractionDigits: 0 })}`;
  if (property.pricing_type === "estimated") {
    const min = format(property.price_min);
    const max = format(property.price_max);
    return min && max ? `${min} – ${max}` : min || max || "Contact for pricing";
  }
  return format(property.price) || "Contact for pricing";
};

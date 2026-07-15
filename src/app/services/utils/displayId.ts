type DisplayIdSource = {
  display_id?: string | null;
  generated_id?: string | null;
  request_code?: string | null;
  reference_no?: string | null;
  display_number?: string | null;
  order_number?: string | null;
  code?: string | null;
  id?: string | null;
};

export const getDisplayId = (value: DisplayIdSource | null | undefined): string => {
  if (!value) {
    return "—";
  }

  return value.display_id
    ?? value.generated_id
    ?? value.request_code
    ?? value.reference_no
    ?? value.display_number
    ?? value.order_number
    ?? value.code
    ?? "—";
};

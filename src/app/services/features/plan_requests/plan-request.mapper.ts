import type { PlanRequest } from "./plan-request.types";

type PlanRequestApi = PlanRequest & {
  request_code?: string | null;
  display_id?: string | null;
};

export const mapPlanRequest = (item: PlanRequestApi): PlanRequest => ({
  ...item,
  request_code: item.request_code ?? null,
  display_id: item.display_id ?? item.request_code ?? null,
});

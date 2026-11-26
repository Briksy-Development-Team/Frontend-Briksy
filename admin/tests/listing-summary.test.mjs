import assert from "node:assert/strict";
import { after, test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true, ws: false } });
after(() => vite.close());

const base = "/src/app/modules/apps/shared_table";
const { SummaryFilters } = await vite.ssrLoadModule(`${base}/entity-list/components/header/SummaryFilters.tsx`);
const { fetchListingCounts, getSummaryFilters } = await vite.ssrLoadModule(`${base}/hooks/useListingSummary.ts`);
const { listingSummaries } = await vite.ssrLoadModule(`${base}/listingSummaries.ts`);
const { default: axios } = await vite.ssrLoadModule("/src/app/services/api/axiosInstance.ts");

const params = {
  page: 4,
  per_page: 10,
  search: "Sydney",
  sort: "title",
  direction: "asc",
  filters: { state: "NSW", created_at: { from: "2026-01-01" }, status: "Published" },
};

test("card buttons change the listing filter, reset the page, and preserve the remaining query", () => {
  const cards = [
    { id: "all", label: "All properties", count: 12, filterKey: "status" },
    { id: "published", label: "Published", count: 8, filterKey: "status", filterValue: "Published", active: true },
    { id: "pending", label: "Pending", count: 0, filterKey: "status", filterValue: "Pending Review" },
    { id: "amount", label: "Page amount", count: "$40" },
  ];
  let query;
  const view = (current, items = cards) => SummaryFilters({
    cards: items, params: current, onParamsChange: (value) => { query = value; },
  });

  let [all, published, pending, amount] = view(params).props.children;
  assert.equal(published.type, "button");
  assert.equal(published.props["aria-pressed"], true);
  assert.match(renderToStaticMarkup(published), /briksy-summary-card--active/);
  assert.equal(amount.type, "div");
  assert.equal(amount.props.onClick, undefined);

  pending.props.onClick();
  assert.deepEqual(query, { ...params, page: 1, filters: { ...params.filters, status: "Pending Review" } });

  [all, published, pending] = view(query, cards.map((card) => ({ ...card, active: card.id === "pending" }))).props.children;
  assert.equal(pending.props["aria-pressed"], true);
  assert.equal(published.props["aria-pressed"], false);
  all.props.onClick();
  const { status, ...otherFilters } = params.filters;
  assert.deepEqual(query, { ...params, page: 1, filters: otherFilters });
  assert.equal(params.filters.status, "Published");
});

test("count requests use each listing endpoint and read the total across pages", async () => {
  const adapter = axios.defaults.adapter;
  const requests = [];
  axios.defaults.adapter = async (config) => {
    requests.push(config);
    return { data: { data: [{ id: "first-row-only" }], meta: { pagination: { total: requests.length * 13 } } } };
  };

  try {
    for (const summary of Object.values(listingSummaries)) {
      requests.length = 0;
      const filters = getSummaryFilters(params.filters, summary);
      const values = await fetchListingCounts(summary.endpoint, { filters, search: params.search }, summary.filterKey, summary.options);
      assert.deepEqual(values, requests.map((_, index) => (index + 1) * 13));
      assert.equal(requests.length, 1 + (summary.options?.length ?? 0));
      for (const [index, request] of requests.entries()) {
        assert.equal(request.url, summary.endpoint);
        assert.equal(request.params.page, 1);
        assert.equal(request.params.per_page, 1);
        assert.equal(request.params.search, "Sydney");
        if (index > 0) {
          const option = summary.options[index - 1];
          assert.equal(request.params.filter[summary.filterKey], typeof option === "string" ? option : option.value);
        }
      }
    }
    assert.deepEqual(getSummaryFilters(params.filters, listingSummaries.property), {
      state: "NSW", created_at: { from: "2026-01-01" },
    });
    assert.deepEqual(getSummaryFilters({ ...params.filters, status: "Pending Review" }, listingSummaries.propertyApprovals), {
      created_at: { from: "2026-01-01" }, status: "Pending Review",
    });
  } finally {
    axios.defaults.adapter = adapter;
  }
});

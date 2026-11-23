const BASE_SIZES = [5, 10, 25, 50, 100];

const getPageSizeOptions = (total: number) => {
  const filtered = BASE_SIZES.filter((s) => s < total);
  return [...filtered, total];
};

type Props = {
  page: number;
  per_page: number;
  total: number;
  onChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  entityName?: string;
};

const Pagination = ({
  page,
  per_page,
  total,
  onChange,
  onPageSizeChange,
  entityName = "records",
}: Props) => {
  const totalPages = Math.ceil(total / per_page);

  const getVisiblePages = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 1);
    const end = Math.min(totalPages, page + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const sizeOptions = getPageSizeOptions(total);

  const from = total === 0 ? 0 : (page - 1) * per_page + 1;
  const to = Math.min(page * per_page, total);

  return (
    <div className="briksy-pagination">
      <div className="briksy-pagination-info">
        {total === 0 ? (
          "No records"
        ) : (
          <>
            Showing {from}–{to} of {total} {entityName}
          </>
        )}
      </div>

      <div className="briksy-pagination-controls">
        <div className="briksy-page-size-wrap">
          <span>Rows per page</span>
          <select
            className="briksy-page-select"
            value={per_page}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {sizeOptions.map((size) => (
              <option key={size} value={size}>
                {size === total ? `${total} (All)` : size}
              </option>
            ))}
          </select>
        </div>

        <div className="briksy-page-btns">
          <button
            type="button"
            className="briksy-page-btn"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
          >
            ‹
          </button>

          {visiblePages.map((p) => (
            <button
              key={p}
              type="button"
              className={`briksy-page-btn ${page === p ? "briksy-page-btn--active" : ""}`}
              onClick={() => onChange(p)}
              aria-label={`Page ${p}`}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            className="briksy-page-btn"
            disabled={page >= totalPages || totalPages === 0}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

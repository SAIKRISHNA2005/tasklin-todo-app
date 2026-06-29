const FILTER_KEYS = ["status", "priority", "tag", "search", "sort", "page", "limit"];

const DEFAULT_FILTERS = {
  status: "",
  priority: "",
  tag: "",
  search: "",
  sort: "-createdAt",
  page: 1,
  limit: 10,
};

export function isValidObjectId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

export function filtersToSearchParams(filters) {
  const params = new URLSearchParams();

  FILTER_KEYS.forEach((key) => {
    const value = filters[key];
    const defaultValue = DEFAULT_FILTERS[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== defaultValue
    ) {
      params.set(key, String(value));
    }
  });

  return params;
}

export function searchParamsToFilters(searchParams) {
  const filters = { ...DEFAULT_FILTERS };

  FILTER_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null && value !== "") {
      if (key === "page" || key === "limit") {
        const parsed = Number.parseInt(value, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          filters[key] = parsed;
        }
      } else {
        filters[key] = value;
      }
    }
  });

  return filters;
}

export function buildListUrl(searchParams) {
  const query = searchParams.toString();
  return query ? `/?${query}` : "/";
}

export function appendListQuery(path, searchParams) {
  const query = searchParams.toString();
  return query ? `${path}?${query}` : path;
}

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

// ─── Default filter shape ──────────────────────────────────────────────────
const DEFAULT_FILTERS = {
  vehicleType: "",
  vehicleStatus: "",
  region: "",
  driver: "",
  startDate: "",
  endDate: "",
  tripStatus: ""
};

const FILTER_KEYS = Object.keys(DEFAULT_FILTERS);

// ─── Context ───────────────────────────────────────────────────────────────
export const FilterContext = createContext(null);

// ─── Provider ──────────────────────────────────────────────────────────────
export const FilterProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL query params on first render (page refresh persistence)
  const [globalFilters, setGlobalFilters] = useState(() => ({
    vehicleType: searchParams.get("vehicleType") || "",
    vehicleStatus: searchParams.get("vehicleStatus") || "",
    region: searchParams.get("region") || "",
    driver: searchParams.get("driver") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    tripStatus: searchParams.get("tripStatus") || ""
  }));

  // Debounce ref for driver search field
  const driverDebounceRef = useRef(null);

  // Immediate display value for driver input (responsive UI)
  const [driverInput, setDriverInput] = useState(globalFilters.driver);

  // Sync globalFilters → URL whenever they change
  useEffect(() => {
    const params = {};
    // Keep all non-filter params already in the URL (id, action, etc.)
    Object.fromEntries(searchParams.entries());
    const currentParams = Object.fromEntries(searchParams.entries());
    Object.keys(currentParams).forEach((k) => {
      if (!FILTER_KEYS.includes(k)) params[k] = currentParams[k];
    });
    // Append active filter values
    Object.entries(globalFilters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params, { replace: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilters]);

  // ── updateGlobalFilter ────────────────────────────────────────────────────
  const updateGlobalFilter = useCallback((key, value) => {
    if (key === "driver") {
      // Update the visible input immediately
      setDriverInput(value);
      // Debounce the API-triggering state update
      if (driverDebounceRef.current) clearTimeout(driverDebounceRef.current);
      driverDebounceRef.current = setTimeout(() => {
        setGlobalFilters((prev) => ({ ...prev, driver: value }));
      }, 300);
    } else {
      setGlobalFilters((prev) => ({ ...prev, [key]: value }));
    }
  }, []);

  // ── resetGlobalFilters ────────────────────────────────────────────────────
  const resetGlobalFilters = useCallback(() => {
    if (driverDebounceRef.current) clearTimeout(driverDebounceRef.current);
    setDriverInput("");
    setGlobalFilters({ ...DEFAULT_FILTERS });
    toast.success("All filters cleared");
  }, []);

  // ── hasActiveGlobalFilters ────────────────────────────────────────────────
  const hasActiveGlobalFilters = useMemo(
    () => Object.values(globalFilters).some((v) => v !== ""),
    [globalFilters]
  );

  // Merged display filters: shows immediate driver input in the UI
  const displayFilters = useMemo(
    () => ({ ...globalFilters, driver: driverInput }),
    [globalFilters, driverInput]
  );

  const value = {
    globalFilters,          // debounced — used by API calls & hooks
    displayFilters,         // immediate — shown in UI inputs
    updateGlobalFilter,
    resetGlobalFilters,
    hasActiveGlobalFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────
export const useGlobalFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) {
    throw new Error("useGlobalFilters must be used inside <FilterProvider>");
  }
  return ctx;
};

export default FilterProvider;

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api, { fetchCsrfToken } from "../lib/api";

export default function useRumahFilter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState(["all"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rumahData, setRumahData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const toggleStatus = (status) => {
    if (status === "all") {
      setStatusFilter(["all"]);
    } else {
      const newFilter = statusFilter.includes("all")
        ? [status]
        : statusFilter.includes(status)
          ? statusFilter.filter((s) => s !== status)
          : [...statusFilter, status];

      setStatusFilter(newFilter.length === 0 ? ["all"] : newFilter);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(["all"]);
    setCurrentPage(1);
  };

  const activeFilterCount = statusFilter.includes("all")
    ? 0
    : statusFilter.length;

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const refetch = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      if (!isMountedRef.current) return;

      setLoading(true);
      setError(null);

      try {
        await fetchCsrfToken();

        const params = new URLSearchParams();
        params.append("tipe", "rumah");
        params.append("page", currentPage);

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (!statusFilter.includes("all")) {
          statusFilter.forEach((s) => params.append("status[]", s));
        }

        const response = await api.get(`/api/data?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!isMountedRef.current) return;

        const responseData = response.data;
        const data = responseData.data;
        const meta = {
          total: responseData.total,
          last_page: responseData.last_page,
          per_page: responseData.per_page,
        };

        setRumahData(data);
        setTotalItems(meta.total);
        setTotalPages(meta.last_page);
        setItemsPerPage(meta.per_page);
      } catch (err) {
        if (
          axios.isCancel(err) ||
          err.name === "AbortError" ||
          err.name === "CanceledError"
        ) {
          return;
        }

        if (!isMountedRef.current) return;

        console.error("Error fetching rumah:", err);
        setError(err.response?.data?.message || "Gagal mengambil data rumah");
        setRumahData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      controller.abort();
    };
  }, [currentPage, searchQuery, statusFilter, refreshTrigger]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    showFilter,
    setShowFilter,
    statusFilter,
    toggleStatus,
    clearFilters,
    activeFilterCount,
    paginatedRumah: rumahData,
    currentPage,
    totalPages,
    totalItems,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
    loading,
    error,
    refetch,
  };
}

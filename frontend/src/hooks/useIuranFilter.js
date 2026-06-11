import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api, { fetchCsrfToken } from "../lib/api";

export default function useIuranFilter() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [tahunFilter, setTahunFilter] = useState(currentYear);
  const [bulanFilter, setBulanFilter] = useState("");
  const [tipe3Filter, setTipe3Filter] = useState("");
  const [statusFilter, setStatusFilter] = useState(["all"]);
  const [rumahFilter, setRumahFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [iuranData, setIuranData] = useState([]);
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
    setTahunFilter(currentYear);
    setBulanFilter("");
    setTipe3Filter("");
    setStatusFilter(["all"]);
    setRumahFilter("");
    setCurrentPage(1);
  };

  const activeFilterCount =
    (statusFilter.includes("all") ? 0 : statusFilter.length) +
    (bulanFilter ? 1 : 0) +
    (tipe3Filter ? 1 : 0) +
    (rumahFilter ? 1 : 0);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleTahunChange = (value) => {
    setTahunFilter(value);
    setCurrentPage(1);
  };

  const handleBulanChange = (value) => {
    setBulanFilter(value);
    setCurrentPage(1);
  };

  const handleTipe3Change = (value) => {
    setTipe3Filter(value);
    setCurrentPage(1);
  };

  const handleRumahFilterChange = (value) => {
    setRumahFilter(value);
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
        params.append("tipe", "bayar");
        params.append("tipe2", "masuk");
        params.append("page", currentPage);
        params.append("tahun", tahunFilter);

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (bulanFilter) {
          params.append("bulan", bulanFilter);
        }

        if (tipe3Filter) {
          params.append("tipe3", tipe3Filter);
        }

        if (!statusFilter.includes("all")) {
          statusFilter.forEach((s) => params.append("status_bayar[]", s));
        }

        if (rumahFilter) {
          params.append("id_data", rumahFilter);
        }

        const response = await api.get(`/api/tran?${params.toString()}`, {
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

        setIuranData(data);
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

        console.error("Error fetching iuran:", err);
        setError(err.response?.data?.message || "Gagal mengambil data iuran");
        setIuranData([]);
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
  }, [currentPage, searchQuery, tahunFilter, bulanFilter, tipe3Filter, statusFilter, rumahFilter, refreshTrigger]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    showFilter,
    setShowFilter,
    tahunFilter,
    setTahunFilter: handleTahunChange,
    bulanFilter,
    setBulanFilter: handleBulanChange,
    tipe3Filter,
    setTipe3Filter: handleTipe3Change,
    statusFilter,
    toggleStatus,
    clearFilters,
    activeFilterCount,
    rumahFilter,
    setRumahFilter: handleRumahFilterChange,
    iuranData,
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
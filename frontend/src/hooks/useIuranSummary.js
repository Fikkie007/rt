import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api, { fetchCsrfToken } from "../lib/api";

export default function useIuranSummary(tahun = new Date().getFullYear()) {
  const [summary, setSummary] = useState(null);
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

        const response = await api.get(`/api/tran/iuran-summary?tahun=${tahun}`, {
          signal: controller.signal,
        });

        if (!isMountedRef.current) return;

        setSummary(response.data);
      } catch (err) {
        if (
          axios.isCancel(err) ||
          err.name === "AbortError" ||
          err.name === "CanceledError"
        ) {
          return;
        }

        if (!isMountedRef.current) return;

        console.error("Error fetching iuran summary:", err);
        setError(err.response?.data?.message || "Gagal mengambil ringkasan iuran");
        setSummary(null);
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
  }, [tahun, refreshTrigger]);

  return {
    summary,
    loading,
    error,
    refetch,
  };
}
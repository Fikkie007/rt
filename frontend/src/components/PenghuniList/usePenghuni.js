import { useState, useCallback } from "react";
import api from "../../lib/api";
import Swal from "sweetalert2";

/**
 * Custom hook for managing penghuni data and API operations
 * @param {Object|null} selectedRumah - The selected rumah object
 * @returns {Object} - penghuni data, loading states, and CRUD operations
 */
export default function usePenghuni(selectedRumah) {
  const [penghuniData, setPenghuniData] = useState(() => {
    // Initialize empty array - data will be fetched via refreshPenghuni callback
    return [];
  });
  const [fetchLoading, setFetchLoading] = useState(() => !selectedRumah);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch penghuni data - exposed as callback for manual refresh
  const refreshPenghuni = useCallback(async () => {
    if (!selectedRumah) {
      return;
    }

    setFetchLoading(true);
    try {
      const response = await api.get("/api/tran", {
        params: {
          id_data: selectedRumah.id,
          tipe: "penghuni",
        },
      });
      setPenghuniData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching penghuni data:", error);
      setPenghuniData([]);
    } finally {
      setFetchLoading(false);
    }
  }, [selectedRumah]);

  // Create penghuni
  const createPenghuni = async (formData) => {
    setSubmitLoading(true);
    try {
      const response = await api.post("/api/tran", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data penghuni berhasil disimpan!",
        timer: 2000,
        showConfirmButton: false,
      });

      await refreshPenghuni();
      return { success: true, data: response.data };
    } catch (error) {
      handleApiError(error, "Gagal menyimpan data penghuni");
      return { success: false };
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update penghuni
  const updatePenghuni = async (penghuniId, formData) => {
    setSubmitLoading(true);
    try {
      formData.append("_method", "PUT");
      const response = await api.post(`/api/tran/${penghuniId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data penghuni berhasil diupdate!",
        timer: 2000,
        showConfirmButton: false,
      });

      await refreshPenghuni();
      return { success: true, data: response.data };
    } catch (error) {
      handleApiError(error, "Gagal mengupdate data penghuni");
      return { success: false };
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete penghuni
  const deletePenghuni = async (penghuniId) => {
    setSubmitLoading(true);
    try {
      await api.delete(`/api/tran/${penghuniId}`);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data penghuni berhasil dihapus!",
        timer: 2000,
        showConfirmButton: false,
      });

      await refreshPenghuni();
      return { success: true };
    } catch (error) {
      handleApiError(error, "Gagal menghapus data penghuni");
      return { success: false };
    } finally {
      setSubmitLoading(false);
    }
  };

  // Fetch KTP image for preview
  const fetchKtpImage = async (fotoKtpPath) => {
    if (!fotoKtpPath) return null;

    try {
      const filename = fotoKtpPath.replace("ktp/", "");
      const response = await api.get(`/api/files/ktp/${filename}`, {
        responseType: "blob",
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching KTP image:", error);
      return null;
    }
  };

  return {
    penghuniData,
    fetchLoading,
    submitLoading,
    refreshPenghuni,
    createPenghuni,
    updatePenghuni,
    deletePenghuni,
    fetchKtpImage,
  };
}

/**
 * Centralized API error handler
 */
function handleApiError(error, defaultMessage) {
  console.error("API Error:", error);

  Swal.fire({
    icon: "error",
    title: "Gagal!",
    text: error.response?.data?.message || defaultMessage,
    html: error.response?.data?.errors
      ? Object.values(error.response.data.errors).flat().join("<br>")
      : undefined,
  });
}

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api, { fetchCsrfToken } from '../lib/api';

export default function useDashboardStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => { isMountedRef.current = false; };
    }, []);

    const refetch = () => setRefreshTrigger(prev => prev + 1);

    useEffect(() => {
        const controller = new AbortController();

        async function loadStats() {
            if (!isMountedRef.current) return;
            setLoading(true);
            setError(null);

            try {
                await fetchCsrfToken();
                const response = await api.get('/api/dashboard/stats', {
                    params: { year },
                    signal: controller.signal,
                });

                if (!isMountedRef.current) return;
                setStats(response.data);
            } catch (err) {
                if (axios.isCancel(err) || err.name === 'AbortError' || err.name === 'CanceledError') return;
                if (!isMountedRef.current) return;
                console.error('Error fetching dashboard stats:', err);
                setError(err.response?.data?.message || 'Gagal memuat statistik dashboard');
            } finally {
                if (isMountedRef.current) setLoading(false);
            }
        }

        loadStats();
        return () => { controller.abort(); };
    }, [year, refreshTrigger]);

    return { stats, loading, error, year, setYear, refetch };
}
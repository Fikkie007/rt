import { useState, useEffect } from 'react';
import { CreditCard, Calendar } from 'lucide-react';
import api from '../lib/api';
import PaymentBadge from './PaymentBadge';

export default function PembayaranList({ selectedRumah }) {
    const [pembayaran, setPembayaran] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!selectedRumah?.id) return;

        const fetchPembayaran = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/tran', {
                    params: {
                        tipe: 'bayar',
                        tipe2: 'masuk',
                        id_data: selectedRumah.id,
                    },
                });
                setPembayaran(response.data.data || response.data || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Gagal memuat data pembayaran');
                setPembayaran([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPembayaran();
    }, [selectedRumah?.id]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                List Pembayaran
            </h3>

            {!selectedRumah ? (
                <div className="py-8 text-center">
                    <CreditCard className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Pilih rumah terlebih dahulu
                    </p>
                </div>
            ) : loading ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data...</p>
                </div>
            ) : error ? (
                <div className="py-8 text-center">
                    <p className="text-sm text-red-500">{error}</p>
                </div>
            ) : pembayaran.length === 0 ? (
                <div className="py-8 text-center">
                    <CreditCard className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tidak ada data pembayaran
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {pembayaran.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{item.nama || item.tipe3}</p>
                                {(item.tanggal || item.tanggal_bayar) && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {item.tanggal || item.tanggal_bayar}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white">
                                    Rp {(item.bayar || 0).toLocaleString('id-ID')}
                                </p>
                                <PaymentBadge status={item.status_bayar || 'belum'} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
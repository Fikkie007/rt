import {
    Wallet,
    Search,
    Filter,
    X,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    RefreshCw,
    Pencil,
    Trash2,
    Calendar,
    Home,
} from 'lucide-react';
import PaymentBadge from './PaymentBadge';
import Tipe2Badge from './Tipe2Badge';

export default function PembayaranTable({
    pembayaranData,
    totalItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
    searchQuery,
    setSearchQuery,
    showFilter,
    setShowFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    statusFilter,
    toggleStatus,
    clearFilters,
    activeFilterCount,
    rumahFilter,
    setRumahFilter,
    rumahOptions,
    loading,
    error,
    refetch,
    onEdit,
    onDelete,
}) {
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    // Format tanggal
    const formatTanggal = (tanggal) => {
        if (!tanggal) return '-';
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    // Format currency
    const formatCurrency = (num) => {
        if (!num) return 'Rp 0';
        return `Rp ${Number(num).toLocaleString('id-ID')}`;
    };

    return (
        <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama rumah..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Filter button */}
                <button
                    onClick={() => setShowFilter(!showFilter)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${showFilter || activeFilterCount > 0
                        ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <Filter size={18} />
                    Filter
                    {activeFilterCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Filter dropdown */}
            {showFilter && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">Filter</h4>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Date Range */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar size={14} className="inline mr-1" />
                            Rentang Tanggal
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Dari</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Sampai</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Rumah Filter */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <Home size={14} className="inline mr-1" />
                            Rumah
                        </label>
                        <select
                            value={rumahFilter}
                            onChange={(e) => setRumahFilter(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Semua Rumah</option>
                            {rumahOptions && rumahOptions.map((rumah) => (
                                <option key={rumah.id} value={rumah.id}>
                                    {rumah.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status Pembayaran
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => toggleStatus('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('all')
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => toggleStatus('lunas')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('lunas')
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40'
                                    }`}
                            >
                                Lunas
                            </button>
                            <button
                                onClick={() => toggleStatus('pending')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('pending')
                                    ? 'bg-orange-600 text-white'
                                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/40'
                                    }`}
                            >
                                Pending
                            </button>
                            <button
                                onClick={() => toggleStatus('terlambat')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('terlambat')
                                    ? 'bg-red-600 text-white'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'
                                    }`}
                            >
                                Terlambat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        List Pembayaran
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {loading ? 'Memuat data...' : (
                            <>
                                {totalItems} pembayaran ditemukan
                                {totalItems > 0 && ` · Menampilkan ${startItem}-${endItem}`}
                            </>
                        )}
                    </p>
                </div>

                {/* Error state */}
                {error && (
                    <div className="p-8 text-center">
                        <AlertCircle className="w-12 h-12 mx-auto text-red-400 dark:text-red-500 mb-3" />
                        <p className="text-red-500 dark:text-red-400 mb-2">{error}</p>
                        <button
                            onClick={refetch}
                            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                            <RefreshCw size={14} />
                            Coba lagi
                        </button>
                    </div>
                )}

                {/* Loading state */}
                {loading && !error && (
                    <div className="p-8 text-center">
                        <Loader2 className="w-12 h-12 mx-auto text-blue-400 dark:text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-500 dark:text-gray-400">
                            Memuat data pembayaran...
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && pembayaranData.length === 0 && (
                    <div className="p-8 text-center">
                        <Wallet className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                            Tidak ada pembayaran ditemukan
                        </p>
                        {(searchQuery || activeFilterCount > 0) && (
                            <button
                                onClick={clearFilters}
                                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                            >
                                Reset filter
                            </button>
                        )}
                    </div>
                )}

                {/* Table */}
                {!loading && !error && pembayaranData.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Rumah
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tipe
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Jumlah
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {pembayaranData.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {startItem + index}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.rumah?.nama ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {item.nama ?? '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                <Tipe2Badge status={item.tipe2} />
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                            {formatTanggal(item.tanggal)}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                                            {formatCurrency(item.bayar)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <PaymentBadge status={item.status_bayar} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => onEdit(item)}
                                                    className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onDelete(item)}
                                                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {!loading && !error && totalPages > 1 && (
                    <div className="p-4 border-t dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Halaman {currentPage} dari {totalPages}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Prev button */}
                            <button
                                onClick={prevPage}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border transition-colors ${currentPage === 1
                                    ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {getPageNumbers().map((page, index) =>
                                    page === '...' ? (
                                        <span
                                            key={`ellipsis-${index}`}
                                            className="px-2 py-1 text-gray-400 dark:text-gray-500"
                                        >
                                            ...
                                        </span>
                                    ) : (
                                        <button
                                            key={page}
                                            onClick={() => goToPage(page)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Next button */}
                            <button
                                onClick={nextPage}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border transition-colors ${currentPage === totalPages
                                    ? 'border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
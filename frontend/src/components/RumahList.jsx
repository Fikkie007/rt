import {
    Home,
    MapPin,
    Users,
    ChevronRight,
    Trash2,
    Search,
    Filter,
    X,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Loader2,
    AlertCircle,
    RefreshCw,
} from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function RumahList({
    paginatedRumah,
    totalItems,
    selectedRumah,
    onSelectRumah,
    onDeleteRumah,
    searchQuery,
    setSearchQuery,
    showFilter,
    setShowFilter,
    statusFilter,
    toggleStatus,
    clearFilters,
    activeFilterCount,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    itemsPerPage,
    loading,
    error,
    refetch,
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

    return (
        <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau alamat..."
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
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Filter Status</h4>
                        <button
                            onClick={clearFilters}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Reset
                        </button>
                    </div>
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
                            onClick={() => toggleStatus('dihuni')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('dihuni')
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Dihuni
                        </button>
                        <button
                            onClick={() => toggleStatus('tidak dihuni')}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter.includes('tidak dihuni')
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            Tidak Dihuni
                        </button>
                    </div>
                </div>
            )}

            {/* List Rumah */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        List Rumah
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {loading ? 'Memuat data...' : (
                            <>
                                {totalItems} rumah ditemukan
                                {activeFilterCount > 0 && ` (filter: ${statusFilter.join(', ')})`}
                                {totalItems > 0 && ` · Menampilkan ${startItem}-${endItem}`}
                            </>
                        )}
                    </p>
                </div>

                <div className="divide-y dark:divide-gray-700">
                    {/* Error state */}
                    {error && (
                        <div className="p-8 text-center">
                            <AlertCircle className="w-12 h-12 mx-auto text-red-400 dark:text-red-500 mb-3" />
                            <p className="text-red-500 dark:text-red-400 mb-2">
                                {error}
                            </p>
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
                                Memuat data rumah...
                            </p>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && paginatedRumah.length === 0 ? (
                        <div className="p-8 text-center">
                            <Home className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 mb-2">
                                Tidak ada rumah ditemukan
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
                    ) : null}

                    {/* Data list */}
                    {!loading && !error && paginatedRumah.length > 0 ? (
                        paginatedRumah.map((rumah) => (
                            <div
                                key={rumah.id}
                                onClick={() => onSelectRumah(rumah)}
                                className={`p-4 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50 group ${selectedRumah?.id === rumah.id
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-600'
                                    : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {rumah.nama}
                                            </h4>
                                            <StatusBadge status={rumah.status} />
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin size={14} />
                                                {rumah.alamat}
                                            </span>
                                            {rumah.penghuniCount > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Users size={14} />
                                                    {rumah.penghuniCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <ChevronRight
                                            size={18}
                                            className={`text-gray-400 transition-transform ${selectedRumah?.id === rumah.id ? 'rotate-90 text-blue-600' : ''
                                                }`}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteRumah(rumah);
                                            }}
                                            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 rounded transition-colors"
                                        >
                                            <Trash2 size={14} />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>

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
                                <ChevronRightIcon size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
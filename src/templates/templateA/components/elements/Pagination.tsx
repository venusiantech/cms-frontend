"use client";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            pages.push(
                <li key="1">
                    <button type="button" className="page-numbers" onClick={() => onPageChange?.(1)}>
                        1
                    </button>
                </li>
            );
            if (startPage > 2) {
                pages.push(
                    <li key="ellipsis-start">
                        <span className="page-numbers">...</span>
                    </li>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li key={i}>
                    {i === currentPage ? (
                        <span aria-current="page" className="page-numbers current">
                            {i}
                        </span>
                    ) : (
                        <button type="button" className="page-numbers" onClick={() => onPageChange?.(i)}>
                            {i}
                        </button>
                    )}
                </li>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(
                    <li key="ellipsis-end">
                        <span className="page-numbers">...</span>
                    </li>
                );
            }
            pages.push(
                <li key={totalPages}>
                    <button type="button" className="page-numbers" onClick={() => onPageChange?.(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pages;
    };

    return (
        <ul className="page-numbers heading">
            {renderPageNumbers()}
            <li>
                <button
                    type="button"
                    className="next page-numbers"
                    onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
                >
                    <i className="icon-right-open-big" />
                </button>
            </li>
        </ul>
    );
} 
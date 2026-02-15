import { Pagination as BsPagination } from 'react-bootstrap';

export default function Pagination({ current, total, limit, onPageChange }) {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    const currentPage = Math.floor(current / limit) + 1;

    const getPages = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    return (
        <BsPagination className="custom-pagination justify-content-center mt-4">
            <BsPagination.First
                disabled={currentPage === 1}
                onClick={() => onPageChange(0)}
            />
            <BsPagination.Prev
                disabled={currentPage === 1}
                onClick={() => onPageChange((currentPage - 2) * limit)}
            />
            {getPages().map((page) => (
                <BsPagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => onPageChange((page - 1) * limit)}
                >
                    {page}
                </BsPagination.Item>
            ))}
            <BsPagination.Next
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage * limit)}
            />
            <BsPagination.Last
                disabled={currentPage === totalPages}
                onClick={() => onPageChange((totalPages - 1) * limit)}
            />
        </BsPagination>
    );
}

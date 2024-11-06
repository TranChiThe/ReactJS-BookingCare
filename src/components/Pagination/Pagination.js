import React from 'react';

class Pagination extends React.Component {

    handlePageChange = (page) => {
        const { onPageChange } = this.props;
        if (onPageChange) {
            onPageChange(page);
        }
    };

    render() {
        const { currentPage, totalPages } = this.props;

        if (totalPages <= 0) return null; // Không hiển thị phân trang nếu không có trang

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => this.handlePageChange(i)}
                    className={currentPage === i ? 'active' : ''}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="pagination">
                <button
                    onClick={() => this.handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                {pages}
                <button
                    onClick={() => this.handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        );
    }
}

export default Pagination;

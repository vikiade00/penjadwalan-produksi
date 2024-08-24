import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          >
            &lt;
          </PaginationLink>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={() => onPageChange(i + 1)}
              className={i + 1 === currentPage ? "bg-blue-500 text-white" : ""}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          >
            &gt;
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;

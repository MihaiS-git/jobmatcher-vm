import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PagePaginationProps = {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
  size: number;
  totalElements: number;
};

const PagePagination = ({
  currentPage,
  onPageChange,
  totalPages,
  size,
  totalElements,
}: PagePaginationProps) => {
  return (
    <div className="flex flex-col items-center gap-1 my-4 w-full">
      <div className="ms-2 flex-1">
        <p className="text-xs">
          Showing {currentPage * size + 1} -{" "}
          {Math.min((currentPage + 1) * size, totalElements)} of {totalElements}
        </p>
      </div>
      <Pagination className="items-center">
        <PaginationContent>
          {currentPage > 0 && (
            <>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => {
                    onPageChange(currentPage - 1);
                  }}
                  className="cursor-pointer"
                />
              </PaginationItem>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}

          {currentPage > 0 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage-1)} className="cursor-pointer">{currentPage}</PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(currentPage)} className="cursor-pointer" isActive={true}>{currentPage + 1}</PaginationLink>
          </PaginationItem>

          {currentPage + 1 < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage + 1)} className="cursor-pointer">{currentPage + 2}</PaginationLink>
            </PaginationItem>
          )}

          {totalPages > currentPage + 1 && (
            <>
              {currentPage + 2 < totalPages && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => {
                    onPageChange(currentPage + 1);
                  }}
                  className="cursor-pointer"
                />
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PagePagination;

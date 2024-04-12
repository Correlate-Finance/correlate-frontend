'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  inputFieldsSchema,
  useCorrelateInputText,
  useCorrelateResponseData,
  useSubmitForm,
} from '@/hooks/usePage';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { z } from 'zod';
import CorrelationCard from './CorrelationCard';
import Results from './Results';
import { Button } from './ui/button';

export default function SearchableTable({ data }: { data: any[] }) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);

  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());

  const toggleCheckbox = (id: number, checked: boolean) => {
    const newCheckedRows = new Set(checkedRows);
    const value = filteredData[id].series_id;
    if (checked) {
      newCheckedRows.add(value);
    } else if (newCheckedRows.has(value)) {
      // Delete if the row exists and checked off
      newCheckedRows.delete(value);
    }

    setCheckedRows(newCheckedRows);
  };

  const filteredData = data.filter(
    (row) =>
      row.title?.toLowerCase().includes(query.toLowerCase()) ||
      row.series_id?.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleAll = (checked: boolean) => {
    const newCheckedRows = new Set(
      Array.from(
        { length: filteredData.length },
        (_, i) => filteredData[i].series_id,
      ),
    );
    if (checked) {
      setCheckedRows((prevRows) => new Set([...prevRows, ...newCheckedRows]));
    } else {
      setCheckedRows(
        (prevRows) =>
          new Set([...prevRows].filter((x) => newCheckedRows.has(x))),
      );
    }
  };

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  // Function to determine page numbers to show
  const paginationNumbers = () => {
    const sideNumbers = 2; // Number of page numbers to show on each side of the current page
    let pages = [];

    // Always include the first page
    pages.push(1);

    // Start and end points for middle pages
    let start = Math.max(2, currentPage - sideNumbers);
    let end = Math.min(pageCount - 1, currentPage + sideNumbers);

    // Adjust start and end if close to page 1 or pageCount
    const gapToStart = currentPage - 1 - sideNumbers;
    const gapToEnd = pageCount - currentPage - sideNumbers;
    if (gapToStart < 2) {
      end = Math.min(end + (2 - gapToStart), pageCount - 1);
    }
    if (gapToEnd < 2) {
      start = Math.max(2, start - (2 - gapToEnd));
    }

    // Add ellipsis if there's a gap from page 1
    if (start > 2) {
      pages.push('ellipsis1');
    }

    // Add the middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if there's a gap to the last page
    if (end < pageCount - 1) {
      pages.push('ellipsis2');
    }

    // Always include the last page
    if (pageCount > 1) {
      pages.push(pageCount);
    }

    return pages;
  };

  // Change page
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);
  const { correlateResponseData, setCorrelateResponseData } =
    useCorrelateResponseData();

  const {
    onSubmit,
    loading: loadingAutomatic,
    hasData,
  } = useSubmitForm(setCorrelateResponseData);

  const { correlateInputText, loading: loadingManual } = useCorrelateInputText(
    setCorrelateResponseData,
  );

  const onSubmitSelected = (
    inputFields: z.infer<typeof inputFieldsSchema>,
  ): void => {
    setShowResults(true);
    onSubmit(inputFields, [...checkedRows]);
  };

  console.log(showResults, hasData, correlateResponseData);

  return (
    <div className="flex overflow-scroll max-h-[90vh]">
      <CorrelationCard
        onAutomaticSubmit={onSubmitSelected}
        loadingAutomatic={loadingAutomatic}
        onManualSubmit={correlateInputText}
        loadingManual={loadingManual}
      />
      <div className="w-full mt-4">
        {!showResults && (
          <>
            <Input
              type="text"
              placeholder="Search by Series ID or Title..."
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on new search
              }}
              className="w-[90%] m-auto mb-4"
            />

            <Table className="mx-8 w-[90%] m-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Checkbox
                      onCheckedChange={(e) => {
                        if (e !== 'indeterminate') {
                          toggleAll(e);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableHead>
                  <TableHead>Series ID</TableHead>
                  <TableHead>Title</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow
                    key={row.series_id}
                    onClick={(e) => {
                      router.push(`/data/${row.series_id}`);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      <Checkbox
                        checked={checkedRows.has(row.series_id)}
                        onCheckedChange={(e) => {
                          if (e !== 'indeterminate') {
                            toggleCheckbox(
                              index + (currentPage - 1) * rowsPerPage,
                              e,
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>{row.series_id}</TableCell>
                    <TableCell>{row.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                  </PaginationItem>
                )}

                {paginationNumbers().map((page) => (
                  <PaginationItem key={page}>
                    {(page === 'ellipsis1' || page === 'ellipsis2') && (
                      <PaginationEllipsis />
                    )}
                    {typeof page === 'number' && (
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                {currentPage < pageCount && (
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </>
        )}

        {showResults && hasData && (
          <div>
            <Button onClick={() => setShowResults(false)} className="mx-2">
              Back to Table Explorer
            </Button>
            <Button
              onClick={() => setCheckedRows(new Set([]))}
              className="mx-2"
            >
              Reset Selection
            </Button>
            <Results data={correlateResponseData} lagPeriods={0} />
          </div>
        )}
      </div>
    </div>
  );
}

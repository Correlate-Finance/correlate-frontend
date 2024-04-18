'use client';

import { DatasetMetadata } from '@/app/api/schema';
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
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import CorrelationCard from './CorrelationCard';
import CorrelationResult from './CorrelationResult';
import CreateIndexModal from './CreateIndexModal';
import { Button } from './ui/button';

export default function SearchableTable({ data }: { data: DatasetMetadata[] }) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [toggleAllChecked, setToggleAllChecked] = useState(false);

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

  const filteredData = useMemo(
    () =>
      data
        .filter(
          (row) =>
            row.title?.toLowerCase().includes(query.toLowerCase()) ||
            row.series_id?.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          const aIsChecked = checkedRows.has(a.series_id);
          const bIsChecked = checkedRows.has(b.series_id);

          if (aIsChecked && !bIsChecked) {
            return -1; // 'a' comes first
          }
          if (!aIsChecked && bIsChecked) {
            return 1; // 'b' comes first
          }
          return 0; // No change
        }),
    [data, query, checkedRows],
  );

  const toggleAll = (checked: boolean) => {
    setToggleAllChecked(checked);
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
          new Set([...prevRows].filter((x) => !newCheckedRows.has(x))),
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

  const { onSubmit, loading: loadingAutomatic } = useSubmitForm(
    setCorrelateResponseData,
  );

  const { correlateInputText, loading: loadingManual } = useCorrelateInputText(
    setCorrelateResponseData,
  );

  const onSubmitSelected = (
    inputFields: z.infer<typeof inputFieldsSchema>,
  ): void => {
    setShowResults(true);
    onSubmit(inputFields, [...checkedRows]);
  };

  return (
    <div>
      {!showResults && (
        <div className="flex flex-row max-h-[90vh]">
          <CorrelationCard
            onAutomaticSubmit={onSubmitSelected}
            loadingAutomatic={loadingAutomatic}
            onManualSubmit={(x) => {
              setShowResults(true);
              correlateInputText(x, [...checkedRows]);
            }}
            loadingManual={loadingManual}
          />
          <div className="w-full mt-4 mx-8">
            <div>
              <Input
                type="text"
                placeholder="Search by Series ID or Title..."
                onChange={(e) => {
                  setQuery(e.target.value);
                  setToggleAllChecked(false);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                className="mb-4"
              />

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Checkbox
                        checked={toggleAllChecked}
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
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-default"
                      >
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
            </div>
          </div>
        </div>
      )}
      {!showResults && checkedRows.size > 0 && (
        <div className="sticky bottom-0 flex flex-row backdrop-blur mx-8 justify-end gap-4">
          <Button
            variant="destructive"
            onClick={() => setCheckedRows(new Set([]))}
            className="dark:bg-red-700 dark:hover:bg-red-900"
          >
            Clear {checkedRows.size} Selected
          </Button>

          <CreateIndexModal
            data={data.filter((dp) => checkedRows.has(dp.series_id))}
          />
        </div>
      )}

      {showResults && (
        <div>
          <button
            className="cursor-pointer flex flex-row ml-6 mt-4 items-center"
            onClick={() => setShowResults(false)}
          >
            <ArrowLeft className="w-4 h-4" />
            <p>Search</p>
          </button>
          <CorrelationResult
            data={correlateResponseData}
            lagPeriods={0}
            inputData={[]}
          />
        </div>
      )}
    </div>
  );
}

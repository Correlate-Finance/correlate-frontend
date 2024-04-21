'use client';

import { DatasetMetadata } from '@/app/api/schema';
import { Checkbox } from '@/components/ui/checkbox';
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
  useCorrelateInputData,
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
import DropdownFilters from './DropdownFilters';
import { Search } from './ui/Search';
import { Button } from './ui/button';

export default function SearchableTable({ data }: { data: DatasetMetadata[] }) {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [toggleAllChecked, setToggleAllChecked] = useState(false);
  const [lagPeriods, setLagPeriods] = useState(0);
  const [dropdownFilterData, setDropdownFilterData] = useState(data);

  const [checkedRows, setCheckedRows] = useState<Set<string>>(new Set());

  const toggleCheckbox = (id: number, checked: boolean) => {
    const newCheckedRows = new Set(checkedRows);
    const value = filteredData[id].internal_name;
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
      dropdownFilterData
        .filter(
          (row) =>
            query === '' ||
            row.external_name?.toLowerCase().includes(query.toLowerCase()) ||
            row.internal_name?.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => {
          const aIsChecked = checkedRows.has(a.internal_name);
          const bIsChecked = checkedRows.has(b.internal_name);

          if (aIsChecked && !bIsChecked) {
            return -1; // 'a' comes first
          }
          if (!aIsChecked && bIsChecked) {
            return 1; // 'b' comes first
          }
          return 0; // No change
        }),
    [query, checkedRows, dropdownFilterData],
  );

  const toggleAll = (checked: boolean) => {
    setToggleAllChecked(checked);
    const newCheckedRows = new Set(
      Array.from(
        { length: filteredData.length },
        (_, i) => filteredData[i].internal_name,
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
  const { correlateInputData, setCorrelateInputData } = useCorrelateInputData();

  const { onSubmit, loading: loadingAutomatic } = useSubmitForm(
    setCorrelateResponseData,
    setCorrelateInputData,
  );

  const { correlateInputText, loading: loadingManual } = useCorrelateInputText(
    setCorrelateResponseData,
    setCorrelateInputData,
  );

  const onSubmitSelected = (
    inputFields: z.infer<typeof inputFieldsSchema>,
  ): void => {
    setShowResults(true);
    onSubmit(inputFields, [...checkedRows]);
  };

  return (
    <div>
      <div className="flex flex-row">
        <CorrelationCard
          onAutomaticSubmit={onSubmitSelected}
          loadingAutomatic={loadingAutomatic}
          onManualSubmit={(x) => {
            setShowResults(true);
            correlateInputText(x, [...checkedRows]);
          }}
          loadingManual={loadingManual}
          setLagPeriods={setLagPeriods}
        />
        {!showResults && (
          <div className="w-2/3 mt-4 mx-8">
            <div className="w-full flex flex-row gap-2 [&>*]:h-10 pb-4">
              <Search
                onChange={(e) => {
                  setQuery(e.target.value);
                  setToggleAllChecked(false);
                  setCurrentPage(1); // Reset to first page on new search
                }}
                type="text"
                placeholder="Search by Series Title"
                className="min-w-[400px]"
              />
              <DropdownFilters
                data={data}
                setFilteredData={setDropdownFilterData}
              />
            </div>

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
                  <TableHead>Title</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Release</TableHead>
                  <TableHead>Categories</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentRows.map((row, index) => (
                  <TableRow
                    key={row.internal_name}
                    onClick={(e) => {
                      router.push(`/data/${row.internal_name}`);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-default"
                    >
                      <Checkbox
                        checked={checkedRows.has(row.internal_name)}
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
                    <TableCell>{row.external_name}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.release}</TableCell>
                    <TableCell>
                      {row.categories.map((category, i) => (
                        <p key={category}>
                          {category}
                          {i == row.categories.length - 1 ? '' : ','}
                        </p>
                      ))}
                    </TableCell>
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
        )}

        {showResults && (
          <div className="flex-1">
            <button
              className="cursor-pointer flex flex-row ml-6 mt-4 items-center"
              onClick={() => setShowResults(false)}
            >
              <ArrowLeft className="w-4 h-4" />
              <p>Search</p>
            </button>
            <CorrelationResult
              data={correlateResponseData}
              lagPeriods={lagPeriods}
              inputData={correlateInputData}
              loading={loadingAutomatic || loadingManual}
            />
          </div>
        )}
      </div>
      {!showResults && checkedRows.size > 0 && (
        <div className="sticky bottom-4 flex flex-row mx-8 justify-end gap-4">
          <Button
            variant="destructive"
            onClick={() => setCheckedRows(new Set([]))}
            className="dark:bg-red-700 dark:hover:bg-red-900"
          >
            Clear {checkedRows.size} Selected
          </Button>

          <CreateIndexModal
            data={data.filter((dp) => checkedRows.has(dp.internal_name))}
          />
        </div>
      )}
    </div>
  );
}

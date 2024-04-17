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
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import CorrelationCard from './CorrelationCard';
import CorrelationResult from './CorrelationResult';
import CreateIndexModal from './CreateIndexModal';
import { Button } from './ui/button';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedicon = <CheckBoxIcon fontSize="small" />;

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  {
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    title: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  {
    title: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  {
    title: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
  { title: 'Saving Private Ryan', year: 1998 },
  { title: 'Once Upon a Time in the West', year: 1968 },
  { title: 'American History X', year: 1998 },
  { title: 'Interstellar', year: 2014 },
  { title: 'Casablanca', year: 1942 },
  { title: 'City Lights', year: 1931 },
  { title: 'Psycho', year: 1960 },
  { title: 'The Green Mile', year: 1999 },
  { title: 'The Intouchables', year: 2011 },
  { title: 'Modern Times', year: 1936 },
  { title: 'Raiders of the Lost Ark', year: 1981 },
  { title: 'Rear Window', year: 1954 },
  { title: 'The Pianist', year: 2002 },
  { title: 'The Departed', year: 2006 },
  { title: 'Terminator 2: Judgment Day', year: 1991 },
  { title: 'Back to the Future', year: 1985 },
  { title: 'Whiplash', year: 2014 },
  { title: 'Gladiator', year: 2000 },
  { title: 'Memento', year: 2000 },
  { title: 'The Prestige', year: 2006 },
  { title: 'The Lion King', year: 1994 },
  { title: 'Apocalypse Now', year: 1979 },
  { title: 'Alien', year: 1979 },
  { title: 'Sunset Boulevard', year: 1950 },
  {
    title:
      'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { title: 'The Great Dictator', year: 1940 },
  { title: 'Cinema Paradiso', year: 1988 },
  { title: 'The Lives of Others', year: 2006 },
  { title: 'Grave of the Fireflies', year: 1988 },
  { title: 'Paths of Glory', year: 1957 },
  { title: 'Django Unchained', year: 2012 },
  { title: 'The Shining', year: 1980 },
  { title: 'WALL·E', year: 2008 },
  { title: 'American Beauty', year: 1999 },
  { title: 'The Dark Knight Rises', year: 2012 },
  { title: 'Princess Mononoke', year: 1997 },
  { title: 'Aliens', year: 1986 },
  { title: 'Oldboy', year: 2003 },
  { title: 'Once Upon a Time in America', year: 1984 },
  { title: 'Witness for the Prosecution', year: 1957 },
  { title: 'Das Boot', year: 1981 },
  { title: 'Citizen Kane', year: 1941 },
  { title: 'North by Northwest', year: 1959 },
  { title: 'Vertigo', year: 1958 },
  {
    title: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { title: 'Reservoir Dogs', year: 1992 },
  { title: 'Braveheart', year: 1995 },
  { title: 'M', year: 1931 },
  { title: 'Requiem for a Dream', year: 2000 },
  { title: 'Amélie', year: 2001 },
  { title: 'A Clockwork Orange', year: 1971 },
  { title: 'Like Stars on Earth', year: 2007 },
  { title: 'Taxi Driver', year: 1976 },
  { title: 'Lawrence of Arabia', year: 1962 },
  { title: 'Double Indemnity', year: 1944 },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { title: 'Amadeus', year: 1984 },
  { title: 'To Kill a Mockingbird', year: 1962 },
  { title: 'Toy Story 3', year: 2010 },
  { title: 'Logan', year: 2017 },
  { title: 'Full Metal Jacket', year: 1987 },
  { title: 'Dangal', year: 2016 },
  { title: 'The Sting', year: 1973 },
  { title: '2001: A Space Odyssey', year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: 'Toy Story', year: 1995 },
  { title: 'Bicycle Thieves', year: 1948 },
  { title: 'The Kid', year: 1921 },
  { title: 'Inglourious Basterds', year: 2009 },
  { title: 'Snatch', year: 2000 },
  { title: '3 Idiots', year: 2009 },
  { title: 'Monty Python and the Holy Grail', year: 1975 },
];

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
              <Autocomplete
                multiple
                limitTags={1}
                id="multiple-limit-tags"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                defaultValue={[
                  top100Films[13],
                  top100Films[12],
                  top100Films[11],
                ]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categories"
                    placeholder="Categories"
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedicon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                renderTags={(tagValue, getTagProps) => {
                  return <></>;
                }}
                sx={{ width: '300px' }}
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

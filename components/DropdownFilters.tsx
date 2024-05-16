import {
  CorrelationDataPoint,
  DatasetFilters,
  DatasetMetadataType,
} from '@/app/api/schema';
import React, { useEffect, useState } from 'react';
import { NoBadgeMultiSelect } from './ui/nobadgemultiselect';

interface DropdownFiltersProps<T> {
  data: T[];
  setFilteredData: (data: T[]) => void;
}

const DropdownFilters = <T extends DatasetMetadataType | CorrelationDataPoint>({
  data,
  setFilteredData,
}: DropdownFiltersProps<T>): React.JSX.Element => {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [filters, setFilters] = useState<DatasetFilters>({
    categories: [],
    source: [],
    release: [],
  });

  // Load the filter values from the DB
  useEffect(() => {
    const categories = new Set<string>([]);
    const releases = new Set<string>([]);
    const sources = new Set<string>([]);

    data?.forEach((element) => {
      element.categories?.forEach((category) => {
        categories.add(category);
      });
      if (element.source) {
        sources.add(element.source);
      }
      if (element.release) {
        releases.add(element.release);
      }
    });

    const caseInsensitiveSort = (a: string, b: string) =>
      a.toLowerCase().localeCompare(b.toLowerCase());
    const sortedCategories = Array.from(categories).sort(caseInsensitiveSort);
    const sortedReleases = Array.from(releases).sort(caseInsensitiveSort);
    const sortedSources = Array.from(sources).sort(caseInsensitiveSort);

    setSelectedCategories(sortedCategories);
    setSelectedReleases(sortedReleases);
    setSelectedSources(sortedSources);
    setFilters({
      categories: sortedCategories,
      source: sortedSources,
      release: sortedReleases,
    });
  }, [data]);

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return (
        row.categories?.some((category) =>
          selectedCategories.includes(category),
        ) &&
        (!row.release || selectedReleases.includes(row.release)) &&
        (!row.source || selectedSources.includes(row.source))
      );
    });
    setFilteredData(filteredData);
  }, [
    selectedSources,
    selectedReleases,
    selectedCategories,
    data,
    setFilteredData,
  ]);

  return (
    <React.Fragment>
      <NoBadgeMultiSelect
        options={filters.source.map((source) => {
          return { value: source, label: source };
        })}
        selected={selectedSources}
        onChange={setSelectedSources}
        label="Source"
      />
      <NoBadgeMultiSelect
        options={filters.release.map((release) => {
          return { value: release, label: release };
        })}
        selected={selectedReleases}
        onChange={setSelectedReleases}
        label="Release"
      />
      <NoBadgeMultiSelect
        options={filters.categories.map((category) => {
          return { value: category, label: category };
        })}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        label="Categories"
      />
    </React.Fragment>
  );
};

export default DropdownFilters;

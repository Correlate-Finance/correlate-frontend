import { getDatasetFilters } from '@/app/api/actions';
import { DatasetFilters, DatasetMetadata } from '@/app/api/schema';
import React, { useEffect, useState } from 'react';
import { NoBadgeMultiSelect } from './ui/nobadgemultiselect';

interface DropdownFiltersProps {
  data: DatasetMetadata[];
  setFilteredData: (data: DatasetMetadata[]) => void;
}

const DropdownFilters: React.FC<DropdownFiltersProps> = ({
  data,
  setFilteredData,
}) => {
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
    getDatasetFilters().then((data) => {
      setFilters(data);
      setSelectedCategories(data.categories);
      setSelectedReleases(data.release);
      setSelectedSources(data.source);
    });
  }, []);

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return (
        row.categories?.some((category) =>
          selectedCategories.includes(category),
        ) &&
        (!row.release || selectedReleases.includes(row.release)) &&
        selectedSources.includes(row.source)
      );
    });
    setFilteredData(filteredData);
  }, [selectedSources, selectedReleases, selectedCategories]);

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

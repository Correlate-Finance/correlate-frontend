import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToExcel(data: number[], date: string[]) {
  return (
    'Date\tValue\n' +
    data.map((dataItem, index) => `${date[index]}\t${dataItem}`).join('\n')
  );
}

export const exportToExcel = (data: any) => {
  if (!data?.length) {
    alert('No data to export');
    return;
  }
  const dataObjValues = data?.map((item: any) => {
    const objValues = Object.values(item);
    return objValues;
  }) as (string | number)[][];
  const dataObjKeys = Object.keys(data?.[0] || {});
  const excelData = [dataObjKeys, ...dataObjValues];

  const ws = XLSX.utils.aoa_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

  const blob = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
  });

  const newBlob = new Blob([blob], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(newBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.xlsx';

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const formatNumber = (number: number | bigint | undefined) => {
  if (number !== undefined) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(number);
  }
  return '';
};

export const formatPercentage = (number: number | bigint | undefined) => {
  if (number !== undefined) {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      maximumFractionDigits: 2,
    }).format(number);
  }
  return '';
};

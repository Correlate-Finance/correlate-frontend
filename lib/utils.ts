import { CorrelationDataPoint } from '@/components/Results';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createExcelSheet(
  data: any,
  filename: string,
  source?: string,
): XLSX.WorkSheet | undefined {
  if (!data?.length) {
    alert('No data to export');
    return;
  }

  const dataObjValues = data?.map((item: any) => {
    const objValues = Object.values(item);
    return objValues;
  }) as (string | number)[][];
  const dataObjKeys = Object.keys(data?.[0]);
  const excelData = [dataObjKeys, ...dataObjValues];

  // Since we are pushing to the start have to append in reverse order
  excelData.unshift(['', '']);
  excelData.unshift(['Source', source ? source : 'example.com']);
  excelData.unshift(['Dataset', filename]);

  const ws = XLSX.utils.aoa_to_sheet(excelData);
  return ws;
}

export const exportToExcelMultipleSheets = (
  datasets: {
    filename: string;
    data: {
      Date: string;
      Value: number;
    }[];
  }[],
) => {
  const wb = XLSX.utils.book_new();
  datasets.forEach((item, index) => {
    const ws = createExcelSheet(item.data, item.filename);
    if (ws === undefined) {
      return;
    }
    XLSX.utils.book_append_sheet(wb, ws, `Sheet ${index + 1}`);
  });

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
  link.download = `datasets.xlsx`;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToExcel = (data: any[], filename: string) => {
  const ws = createExcelSheet(data, filename);
  if (ws === undefined) {
    return;
  }

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
  link.download = `${filename}.xlsx`;

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

export const convertToGraphData = (dp: CorrelationDataPoint) => {
  const total = dp.dates.length;
  const combinedList = dp.dates.map((date, index) => {
    return {
      date,
      // For revenue we want to remove items from the bottom of the list.
      revenue: index < dp.lag ? null : dp.input_data[index],
      // for dataset we want to remove items from the top.
      dataset: index >= total - dp.lag ? null : dp.dataset_data[index],
    };
  });
  return combinedList;
};

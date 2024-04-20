import { CorrelationDataPoint } from '@/app/api/schema';
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
  description?: string,
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
  excelData.unshift(['Source', source ? source : '']);
  excelData.unshift(['Description', description ? description : '']);
  excelData.unshift(['Dataset', filename]);

  const ws = XLSX.utils.aoa_to_sheet(excelData);
  return ws;
}

export const exportToExcelMultipleSheets = (
  datasets: {
    filename: string;
    sheet_name: string;
    source?: string;
    description?: string;
    data: {
      Date: string;
      Value: number;
    }[];
  }[],
) => {
  const wb = XLSX.utils.book_new();
  datasets.forEach((item, index) => {
    const ws = createExcelSheet(
      item.data,
      item.filename,
      item.source,
      item.description,
    );
    if (ws === undefined) {
      return;
    }
    XLSX.utils.book_append_sheet(wb, ws, item.sheet_name);
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

export const exportToExcel = (
  data: any[],
  filename: string,
  source?: string,
  description?: string,
) => {
  const ws = createExcelSheet(data, filename, source, description);
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

export const exportMultipleToExcel = (data: CorrelationDataPoint[]) => {
  const export_data = data.map((dp) => {
    return {
      filename: dp.title,
      source: dp.source,
      description: dp.description,
      sheet_name: dp.internal_name,
      data: dp.dataset_data.map((value, index) => {
        return {
          Date: dp.dates[index],
          Value: value,
        };
      }),
    };
  });

  exportToExcelMultipleSheets(export_data);
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

export const correlationCoefficient = (x: number[], y: number[]) => {
  if (x.length !== y.length) {
    throw new Error('X and Y arrays must have the same length');
  }

  // Calculate the mean of x and y
  var meanX = x.reduce((a, b) => a + b, 0) / x.length;
  var meanY = y.reduce((a, b) => a + b, 0) / y.length;

  // Calculate the covariance of x and y
  // var covariance =
  //   x.reduce((a, b, i) => a + (b - meanX) * (y[i] - meanY), 0) / (x.length - 1);

  let covariance = 0;
  for (let i = 0; i < x.length; i++) {
    covariance += (x[i] - meanX) * (y[i] - meanY);
  }
  covariance /= x.length - 1;

  // Calculate the standard deviation of x and y
  var stdX = Math.sqrt(
    x.reduce((a, b) => a + (b - meanX) ** 2, 0) / (x.length - 1),
  );
  var stdY = Math.sqrt(
    y.reduce((a, b) => a + (b - meanY) ** 2, 0) / (y.length - 1),
  );
  // Calculate the correlation coefficient
  return covariance / (stdX * stdY);
};

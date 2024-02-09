import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DataFormatter = (
  number: number | bigint | undefined,
) => {
  if (number !== undefined) {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
    }).format(number);
  }
  return '';
};

export function convertToExcel(data: number[], date: string[]) {
  return (
    'Date\tValue\n' +
    data
      .map((dataItem, index) => `${date[index]}\t${dataItem}`)
      .join('\n')
  );
}

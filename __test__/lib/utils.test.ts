import { CorrelationDataPoint } from '@/components/Results';
import {
  cn,
  convertToGraphData,
  createExcelSheet,
  exportToExcel,
  exportToExcelMultipleSheets,
  formatNumber,
  formatPercentage,
} from '@/lib/utils';
import * as XLSX from 'xlsx';

// Mocking dependencies
jest.mock('xlsx', () => ({
  utils: {
    aoa_to_sheet: jest.fn().mockReturnValue({}),
    book_new: jest.fn().mockReturnValue({}),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn().mockReturnValue(new ArrayBuffer(10)),
}));

global.Blob = jest.fn();
global.URL.createObjectURL = jest.fn().mockReturnValue('blob:url');
global.URL.revokeObjectURL = jest.fn();
jest.spyOn(document, 'createElement').mockReturnValue({
  href: '',
  download: '',
  click: jest.fn(),
} as unknown as HTMLAnchorElement);
jest
  .spyOn(document.body, 'appendChild')
  .mockReturnValue(document.createElement('div'));
jest
  .spyOn(document.body, 'removeChild')
  .mockReturnValue(document.createElement('div'));

describe('Unit tests for various functions', () => {
  describe('cn function', () => {
    it('should combine class names into one string', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });
  });

  describe('createExcelSheet function', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clears any previous interactions with mocks
      window.alert = jest.fn(); // Mock window.alert
    });

    it('should alert and return undefined if data is null', () => {
      const result = createExcelSheet(null, 'test');
      expect(window.alert).toHaveBeenCalledWith('No data to export');
      expect(result).toBeUndefined();
    });

    it('should alert and return undefined if data is undefined', () => {
      const result = createExcelSheet(undefined, 'test');
      expect(window.alert).toHaveBeenCalledWith('No data to export');
      expect(result).toBeUndefined();
    });

    it('should include custom headers in the Excel sheet', () => {
      const mockData = [{ Name: 'John Doe', Age: 30 }];
      const sheet = createExcelSheet(mockData, 'test');
      expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalledWith(
        expect.arrayContaining([
          ['', ''],
          ['Source', 'example.com'],
          ['Dataset', 'test'],
          ['Name', 'Age'],
          ['John Doe', 30],
        ]),
      );
      expect(sheet).toBeDefined();
    });
  });

  describe('formatNumber function', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1K'); // Assumes the output is '1K', adjust based on actual implementation
      expect(formatNumber(undefined)).toBe('');
    });
  });

  describe('formatPercentage function', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(0.5)).toBe('50%'); // Assumes the output is '50%', adjust based on actual implementation
      expect(formatPercentage(undefined)).toBe('');
    });
  });

  describe('exportToExcelMultipleSheets function', () => {
    beforeEach(async () => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should create a workbook and add sheets for each dataset', () => {
      const mockDatasets = [
        {
          filename: 'Sheet1',
          sheet_name: 'Sheet1',
          data: [{ Date: '2022-01-01', Value: 100 }],
        },
        {
          filename: 'Sheet2',
          sheet_name: 'Sheet2',
          data: [{ Date: '2022-01-02', Value: 200 }],
        },
      ];

      exportToExcelMultipleSheets(mockDatasets);

      // Verify that a new workbook is created
      expect(XLSX.utils.book_new).toHaveBeenCalled();

      expect(XLSX.utils.book_append_sheet).toHaveBeenCalledTimes(
        mockDatasets.length,
      );

      // Verify XLSX.write is called with the workbook
      expect(XLSX.write).toHaveBeenCalledWith(
        {},
        { bookType: 'xlsx', type: 'array' },
      );

      // Verify Blob is created with the right type
      expect(Blob).toHaveBeenCalledWith([expect.any(ArrayBuffer)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Verify download link is created and clicked
      const link = document.createElement('a'); // Create a new element with the 'a' tag
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(link.click).toHaveBeenCalled();
    });

    it('should not add a sheet if createExcelSheet returns undefined', () => {
      const mockDatasets = [
        { filename: 'Sheet1', sheet_name: 'Sheet1', data: [] },
      ]; // Empty data will cause createExcelSheet to return undefined

      // (createExcelSheet as jest.Mock).mockReturnValueOnce(undefined);

      exportToExcelMultipleSheets(mockDatasets);

      // Verify that book_append_sheet is not called since createExcelSheet returned undefined
      expect(XLSX.utils.book_append_sheet).not.toHaveBeenCalled();
    });
  });

  describe('exportToExcel function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create and download an Excel file', () => {
      const mockData = [{ dataset: [{ id: 1, value: 'A' }], filename: 'test' }];

      exportToExcel(mockData, 'test-file');

      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.write).toHaveBeenCalledWith(
        {},
        { bookType: 'xlsx', type: 'array' },
      );

      // Verify Blob creation
      expect(Blob).toHaveBeenCalledWith([expect.any(ArrayBuffer)], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Verify download link operations
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();

      const link = document.createElement('a');
      expect(link.click).toHaveBeenCalled();
    });

    it('should not create a file if createExcelSheet returns undefined', () => {
      exportToExcel([], 'test-file');

      // Verify that book_append_sheet is not called since createExcelSheet returned undefined
      expect(XLSX.utils.book_append_sheet).not.toHaveBeenCalled();
    });
  });

  describe('convertToGraphData function', () => {
    it('should correctly convert data points to graph data format', () => {
      const dp: CorrelationDataPoint = {
        dates: ['2022-01-01', '2022-01-02', '2022-01-03', '2022-01-04'],
        lag: 1,
        input_data: [100, 200, 300, 400],
        dataset_data: [1, 2, 3, 4],
        title: '',
        pearson_value: 0,
        p_value: 0,
        internal_name: '',
      };

      const expectedResult = [
        { date: '2022-01-01', revenue: null, dataset: 1 },
        { date: '2022-01-02', revenue: 200, dataset: 2 },
        { date: '2022-01-03', revenue: 300, dataset: 3 },
        { date: '2022-01-04', revenue: 400, dataset: null },
      ];

      const result = convertToGraphData(dp);

      expect(result).toEqual(expectedResult);
    });
  });
});

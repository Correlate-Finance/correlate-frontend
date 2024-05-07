import React from 'react';
import GenerateManualReportModal from './GenerateManualReportModal';
import { Button } from './ui/button';

interface ComponentProps {
  generateReport: (stock?: string, name?: string, description?: string) => void;
  stock?: string;
}

const GenerateReportButton: React.FC<ComponentProps> = ({
  generateReport,
  stock,
}) => {
  let onclick = () => {
    if (stock) {
      generateReport(stock);
    }
  };
  return (
    <>
      {stock && (
        <Button
          onClick={onclick}
          className="flex bg-[#517AF3] hover:bg-[#3e5cb8] text-white"
          data-testid="manual-correlate-button"
        >
          Generate Report
        </Button>
      )}
      {!stock && <GenerateManualReportModal generateReport={generateReport} />}
    </>
  );
};

export default GenerateReportButton;

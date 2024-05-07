import { generateReport } from '@/app/api/actions';
import { CorrelationData } from '@/app/api/schema';
import { toast } from '@/components/ui/use-toast';

export async function getReport({
  correlateResponseData,
  name,
  stock,
  description,
}: {
  correlateResponseData: CorrelationData;
  stock?: string;
  description?: string;
  name?: string;
}) {
  // Take the top 100 company names from the response data
  const top_datasets = correlateResponseData.data.slice(0, 100);

  if (!name && !stock) {
    return;
  }

  toast({
    title: 'Generating Report',
    description: 'The report is being generated for ' + name || stock,
  });

  const data = await generateReport(
    top_datasets,
    correlateResponseData.correlationParametersId,
    stock,
    name,
    description,
  );

  toast({
    title: 'Report Generated',
    description: 'The report has been generated',
    action: (
      <button
        onClick={() => {
          window.location.href = '/report/' + data.report_id;
        }}
        className="text-blue-500 underline"
      >
        View Report
      </button>
    ),
  });
}

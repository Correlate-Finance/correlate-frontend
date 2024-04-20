import { CorrelationData } from '@/app/api/schema';
import InputData from './InputData';
import Results from './Results';

interface ComponentProps {
  data: CorrelationData;
  lagPeriods: number;
  inputData: string[][];
}

const CorrelationResult = ({ data, lagPeriods, inputData }: ComponentProps) => {
  return (
    <div>
      <div className="m-5 flex flex-row justify-between gap-8">
        <InputData data={inputData} />
        <div className="flex-1">
          <Results data={data} lagPeriods={lagPeriods} />
        </div>
      </div>
    </div>
  );
};

export default CorrelationResult;

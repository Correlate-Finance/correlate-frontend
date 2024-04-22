import { CorrelationData } from '@/app/api/schema';
import ChartBar from '@/assets/ChartBar';
import InputData from './InputData';
import Results from './Results';
import Loading from './animations/Loading';

interface ComponentProps {
  data: CorrelationData;
  lagPeriods: number;
  inputData: string[][];
  loading: boolean;
}

const CorrelationResult = ({
  data,
  lagPeriods,
  inputData,
  loading,
}: ComponentProps) => {
  const aggregationPeriod = data.aggregationPeriod;
  const correlationMetric = data.correlationMetric;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full ml-4">
        <Loading />
      </div>
    );
  } else if (data.data.length == 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-full gap-2 ml-4">
        <ChartBar />
        <h1 className="text-4xl text-center font-bold">It’s empty in here</h1>
        <p className="w-[40%] text-center">
          Get started by running your first correlation. You can choose a stock
          ticker or input your own data manually.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-4">
      <div className="m-5 flex flex-row justify-between gap-8 ml-4">
        <InputData data={inputData} />
        <div className="flex-1">
          <Results
            data={{
              data: data.data,
              aggregationPeriod,
              correlationMetric,
            }}
            lagPeriods={lagPeriods}
          />
        </div>
      </div>
    </div>
  );
};

export default CorrelationResult;

'use client';

import ChartBar from '@/assets/ChartBar';
import CorrelationCard from '@/components/CorrelationCard';
import InputData from '@/components/InputData';
import Results from '@/components/Results';
import Loading from '@/components/animations/Loading';
import {
  useCorrelateInputData,
  useCorrelateInputText,
  useCorrelateResponseData,
  useSubmitForm,
} from '@/hooks/usePage';
import { useState } from 'react';

const HomePage = () => {
  const [lagPeriods, setLagPeriods] = useState(0);
  const { correlateResponseData, setCorrelateResponseData } =
    useCorrelateResponseData();
  const { correlateInputData, setCorrelateInputData } = useCorrelateInputData();

  const {
    onSubmit: onSubmitAutomatic,
    loading: loadingAutomatic,
    hasData,
  } = useSubmitForm(setCorrelateResponseData, setCorrelateInputData);
  const { correlateInputText, loading: loadingManual } = useCorrelateInputText(
    setCorrelateResponseData,
    setCorrelateInputData,
  );
  const loading = loadingAutomatic || loadingManual;

  return (
    <div className="flex overflow-scroll min-h-[90vh]">
      <CorrelationCard
        onAutomaticSubmit={onSubmitAutomatic}
        loadingAutomatic={loadingAutomatic}
        onManualSubmit={(x) => {
          correlateInputText(x);
        }}
        loadingManual={loadingManual}
        setLagPeriods={setLagPeriods}
      />

      {loading && (
        <div className="flex flex-col justify-center items-center">
          <Loading />
        </div>
      )}

      {hasData && !loading && (
        <div className="m-5 flex flex-row justify-between w-3/4 gap-8">
          <div className="w-min">
            <InputData data={correlateInputData} />
          </div>
          <div className="flex-1">
            <Results data={correlateResponseData} lagPeriods={lagPeriods} />
          </div>
        </div>
      )}
      {!hasData && !loading && (
        <div className="flex flex-col justify-center items-center w-full gap-2">
          <ChartBar />
          <h1 className="text-4xl text-center font-bold">It’s empty in here</h1>
          <p className="w-[40%] text-center">
            Get started by running your first correlation. You can choose a
            stock ticker or input your own data manually.
          </p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

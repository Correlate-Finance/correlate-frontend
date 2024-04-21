'use client';

import CorrelationCard from '@/components/CorrelationCard';
import CorrelationResult from '@/components/CorrelationResult';
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

  const { onSubmit: onSubmitAutomatic, loading: loadingAutomatic } =
    useSubmitForm(setCorrelateResponseData, setCorrelateInputData);
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

      <CorrelationResult
        data={correlateResponseData}
        lagPeriods={lagPeriods}
        inputData={correlateInputData}
        loading={loading}
      />
    </div>
  );
};

export default HomePage;

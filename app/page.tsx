'use client';

import CorrelationCard from '@/components/CorrelationCard';
import CorrelationResult from '@/components/CorrelationResult';
import {
  inputFieldsSchema,
  useCorrelateInputData,
  useCorrelateInputText,
  useCorrelateResponseData,
  useSubmitForm,
} from '@/hooks/usePage';
import { useState } from 'react';
import { z } from 'zod';

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
    <div className="flex min-h-[90vh]">
      <CorrelationCard
        onAutomaticSubmit={(inputFields: z.infer<typeof inputFieldsSchema>) =>
          onSubmitAutomatic({ inputFields })
        }
        loadingAutomatic={loadingAutomatic}
        onManualSubmit={(inputFields: z.infer<typeof inputFieldsSchema>) => {
          correlateInputText({ inputFields });
        }}
        loadingManual={loadingManual}
        setLagPeriods={setLagPeriods}
      />
      <div className="flex-1">
        <CorrelationResult
          data={correlateResponseData}
          lagPeriods={lagPeriods}
          inputData={correlateInputData}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HomePage;

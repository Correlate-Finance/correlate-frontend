import React from 'react';
import { TooltipProps } from 'recharts';
import {
  ValueType,
  NameType,
} from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  console.log(payload);

  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-100">
        <p className="text-black">{`Date: ${label}`}</p>
        <p className="text-[#AA4A44]">
          {`Revenue: ${payload[0].value}`}{' '}
        </p>
        <p className="text-[#82ca9d]">
          {`Dataset: ${payload[1].value}`}{' '}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;

import { DataFormatter } from '@/lib/utils';
import { TooltipProps } from 'recharts';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-100">
        <p className="text-black">{`Date: ${label}`}</p>
        <p className="text-[#AA4A44]">
          {`Revenue: ${DataFormatter(Number(payload[0]?.value))}`}{' '}
        </p>
        <p className="text-[#82ca9d]">
          {`Dataset: ${DataFormatter(Number(payload[1]?.value))}`}{' '}
        </p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;

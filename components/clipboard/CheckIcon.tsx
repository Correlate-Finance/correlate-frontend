import React from 'react';

interface CheckIconAttributes {
  className?: string;
  style?: object;
}

const CheckIcon: React.FC<CheckIconAttributes> = ({
  className,
  style,
}: CheckIconAttributes) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M13.25 4.75L6 12L2.75 8.75" />
    </svg>
  );
};

export default CheckIcon;

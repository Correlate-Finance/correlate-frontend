import React, { PropsWithChildren } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type SkeletonProps = React.ComponentPropsWithoutRef<typeof Skeleton>;

function InlineWrapperWithMargin({ children }: PropsWithChildren<unknown>) {
  return <span style={{ margin: '0.5rem' }}>{children}</span>;
}

const SkeletonComp = ({ ...props }: SkeletonProps) => {
  return (
    <SkeletonTheme baseColor="#737373" highlightColor="#444">
      <p>
        <Skeleton wrapper={InlineWrapperWithMargin} {...props} />
      </p>
    </SkeletonTheme>
  );
};

export default SkeletonComp;

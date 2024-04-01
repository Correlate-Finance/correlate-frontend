import loadingLottie from '@/lib/animations/animation-loading.json';
import Lottie from 'lottie-react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Lottie animationData={loadingLottie} className="w-32 h-32" />
    </div>
  );
};

export default Loading;

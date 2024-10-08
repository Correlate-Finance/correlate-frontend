import ladingAnimation from '@/assets/animations/loading.json';
import Lottie from 'lottie-react';

// This component is for adding a loading icon.
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <Lottie animationData={ladingAnimation} className="w-32 h-32" />
    </div>
  );
};

export default Loading;

import React, { useState } from 'react';

interface ExpandableTextProps {
  text: string;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="p-4">
      <div
        className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[none]' : 'max-h-18'} overflow-hidden`}
      >
        <p className={`${!isExpanded ? 'line-clamp-3' : ''}`}>{text}</p>
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 text-blue-500 hover:text-blue-600 transition-colors"
      >
        {isExpanded ? 'See Less' : 'See More'}
      </button>
    </div>
  );
};

export default ExpandableText;

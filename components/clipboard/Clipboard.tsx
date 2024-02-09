import React from 'react';
import Check from './CheckIcon';
import Clippy from './ClippyIcon';

interface ClipboardProps {
  copied: boolean;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
  text: string;
  color: string;
}

const Clipboard: React.FC<ClipboardProps> = ({
  copied,
  setCopied,
  text,
  color,
}: ClipboardProps) => {
  const isColor = (strColor: string) => {
    if (strColor === undefined) {
      return false;
    } else {
      const s = new Option().style;
      s.color = strColor;
      return s.color !== '';
    }
  };

  return (
    <div
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(text);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }}
      className="cursor-pointer bg-transparent grid w-fit"
    >
      <Clippy
        className="icon col-start-1 row-start-1"
        style={{
          color: isColor(color) ? color : 'black',
          strokeDasharray: 50,
          strokeDashoffset: copied ? -50 : 0,
          transition: 'all 300ms ease-in-out',
        }}
      />
      <Check
        className="icon col-start-1 row-start-1"
        style={{
          color: isColor(color) ? color : 'black',
          strokeDasharray: 50,
          strokeDashoffset: copied ? 0 : -50,
          transition: 'all 300ms ease-in-out',
        }}
      />
    </div>
  );
};

export default Clipboard;

import { useEffect, useRef, useState } from 'react';
import copyToClipboard from 'copy-to-clipboard';

const useClipboardCopy = (text: string) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const userFeedbackTimer = useRef<any>(null);
  const handleClipboardCopy = () => {
    setIsCopied(true);
    copyToClipboard(text);
    userFeedbackTimer.current = setTimeout(() => setIsCopied(false), 2000);
  };

  /*
   * We need to wrap the call in a second function, since only the returned
   * function gets called on unmount.
   * The first one is only called on render.
   */
  useEffect(() => () => clearTimeout(userFeedbackTimer.current), [
    userFeedbackTimer,
  ]);

  return {
    handleClipboardCopy,
    isCopied,
  };
};

export default useClipboardCopy;

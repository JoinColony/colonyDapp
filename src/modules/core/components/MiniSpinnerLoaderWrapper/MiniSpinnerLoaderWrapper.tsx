import React, { ReactNode, useEffect, useState } from 'react';

import { MiniSpinnerLoader } from '~core/Preloaders';

interface Props {
  children: ReactNode;
  milliseconds: number;
}

const MiniSpinnerLoaderWrapper = ({ children, milliseconds }: Props) => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setShowLoading(false);
    }, milliseconds);
    return () => clearTimeout(loadingTimeout);
  }, [milliseconds]);

  return <div>{showLoading ? <MiniSpinnerLoader /> : children}</div>;
};

const displayName = 'MiniSpinnerLoaderWrapper';

MiniSpinnerLoaderWrapper.displayName = displayName;

export default MiniSpinnerLoaderWrapper;

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useColonyNativeTokenQuery, useTokenInfoLazyQuery } from '~data/index';
import { Address } from '~types/index';

export type TokenInfo = {
  colonyAddress: string;
};

const TokenInfoContext = createContext<Partial<TokenInfo>>({});

export type Props = {
  children: ReactNode;
  colonyAddress: Address;
};

export const TokenInfoProvider = ({ children, colonyAddress }: Props) => (
  <TokenInfoContext.Provider
    value={{
      colonyAddress,
    }}
  >
    {children}
  </TokenInfoContext.Provider>
);

export const useTokenInfo = () => {
  const { colonyAddress } = useContext(TokenInfoContext);

  const { data: nativeTokenAddressData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress || '' },
  });

  const [fetchTokenInfo, { data: tokenInfoData }] = useTokenInfoLazyQuery();

  useEffect(() => {
    if (nativeTokenAddressData) {
      const {
        processedColony: { nativeTokenAddress },
      } = nativeTokenAddressData;
      fetchTokenInfo({ variables: { address: nativeTokenAddress } });
    }
  }, [fetchTokenInfo, nativeTokenAddressData]);

  return {
    tokenInfoData,
  };
};

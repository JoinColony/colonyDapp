import React, { useContext } from 'react';

export interface StreamingContextType {
  setRatesWithError: React.Dispatch<React.SetStateAction<number[]>>;
  setLimitsWithError: React.Dispatch<React.SetStateAction<number[]>>;
}

const StreamingContext = React.createContext<StreamingContextType>({
  setRatesWithError: () => {},
  setLimitsWithError: () => {},
});

export const StreamingContextProvider = StreamingContext.Provider;

export const useStreamingContext = (): StreamingContextType =>
  useContext(StreamingContext);

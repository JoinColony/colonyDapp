import React, { useContext } from 'react';

export interface StreamingErrorsContextType {
  setRatesWithError: React.Dispatch<React.SetStateAction<number[]>>;
  setLimitsWithError: React.Dispatch<React.SetStateAction<number[]>>;
}

const StreamingErrorsContext = React.createContext<StreamingErrorsContextType>({
  setRatesWithError: () => {},
  setLimitsWithError: () => {},
});

export const StreamingErrorsContextProvider = StreamingErrorsContext.Provider;

export const useStreamingErrorsContext = (): StreamingErrorsContextType =>
  useContext(StreamingErrorsContext);

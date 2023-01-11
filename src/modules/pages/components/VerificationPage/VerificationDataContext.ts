import React, { useContext } from 'react';

import { initialFormValues } from './constants';
import { ContextValuesType } from './types';

export interface VerificationDataContextType {
  formValues: ContextValuesType;
  setFormValues: React.Dispatch<React.SetStateAction<ContextValuesType>>;
}

const VerificationDataContext = React.createContext<
  VerificationDataContextType
>({
  formValues: initialFormValues,
  setFormValues: () => {},
});

export const VerificationDataContextProvider = VerificationDataContext.Provider;

export const useVerificationContext = (): VerificationDataContextType =>
  useContext(VerificationDataContext);

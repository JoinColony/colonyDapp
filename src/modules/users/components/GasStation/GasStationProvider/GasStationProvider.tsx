import React, { createContext, useState, ReactNode } from 'react';

export const GasStationContext = createContext<{
  transactionAlerts: Record<string, { seen: boolean }>;
  updateTransactionAlert: (
    transactionId: string,
    alertPayload: { seen?: boolean },
  ) => void;
}>({
  transactionAlerts: {},
  updateTransactionAlert: () => {},
});

interface Props {
  children: ReactNode;
}

const GasStationProvider = ({ children }: Props) => {
  const [transactionAlerts, updateTransactionAlerts] = useState<
    Record<string, { seen: boolean }>
  >({});

  const updateTransactionAlert = (
    transactionId: string,
    /*
     * @NOTE This was thought about being extendable, so that more props can
     * be tracked for a transactions from component land (eg: isOpen)
     */
    alertPayload: { seen?: boolean },
  ) =>
    updateTransactionAlerts({
      ...transactionAlerts,
      [transactionId]: {
        ...(transactionAlerts[transactionId] || {}),
        ...alertPayload,
      },
    });

  return (
    <>
      <GasStationContext.Provider
        value={{
          transactionAlerts,
          updateTransactionAlert,
        }}
      >
        {children}
      </GasStationContext.Provider>
    </>
  );
};

export default GasStationProvider;

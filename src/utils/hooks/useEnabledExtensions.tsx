import { Extension } from '@colony/colony-js';
import { useColonyExtensionsQuery } from '~data/index';
import { Address } from '~types/index';

interface Props {
  colonyAddress?: Address;
}

export const useEnabledExtensions = ({ colonyAddress }: Props) => {
  const { data: colonyExtensionsData } = useColonyExtensionsQuery({
    variables: { address: colonyAddress || '' },
  });
  const installedExtensions =
    colonyExtensionsData?.processedColony?.installedExtensions || [];
  const isVotingExtensionEnabled = !!installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );
  const isOneTxPaymentExtensionEnabled = !!installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.OneTxPayment,
  );

  return {
    isVotingExtensionEnabled,
    isOneTxPaymentExtensionEnabled,
  };
};

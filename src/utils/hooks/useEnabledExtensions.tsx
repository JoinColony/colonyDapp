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

  const installedVotingExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );
  const installedOneTxPaymentExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );
  const isVotingExtensionEnabled = !!(
    installedVotingExtension &&
    installedVotingExtension.details.initialized &&
    !installedVotingExtension.details.deprecated
  );
  const isOneTxPaymentExtensionEnabled = !!(
    installedOneTxPaymentExtension &&
    installedOneTxPaymentExtension.details.initialized &&
    !installedOneTxPaymentExtension.details.deprecated
  );

  return {
    isVotingExtensionEnabled,
    isOneTxPaymentExtensionEnabled,
  };
};

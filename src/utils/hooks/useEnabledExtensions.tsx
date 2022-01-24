import { Extension } from '@colony/colony-js';
import { useColonyExtensionsQuery } from '~data/index';
import { Address } from '~types/index';

interface Props {
  colonyAddress?: Address;
}

export const useEnabledExtensions = ({ colonyAddress }: Props) => {
  const { data: colonyExtensionsData, loading } = useColonyExtensionsQuery({
    variables: { address: colonyAddress || '' },
  });
  const installedExtensions =
    colonyExtensionsData?.processedColony?.installedExtensions || [];

  const installedVotingExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.VotingReputation,
  );
  const installedOneTxPaymentExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.OneTxPayment,
  );

  const installedWhitelistExtension = installedExtensions.find(
    ({ extensionId }) => extensionId === Extension.Whitelist,
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

  const installedExtensionsAddresses = installedExtensions.map((extension) =>
    extension.address?.toLowerCase(),
  );
  const isWhitelistExtensionEnabled = !!(
    installedWhitelistExtension &&
    installedWhitelistExtension.details.initialized &&
    !installedWhitelistExtension.details.deprecated
  );

  return {
    isVotingExtensionEnabled,
    isOneTxPaymentExtensionEnabled,
    installedExtensionsAddresses,
    isWhitelistExtensionEnabled,
    whitelistAddress: installedWhitelistExtension?.address,
    isLoadingExtensions: loading,
  };
};

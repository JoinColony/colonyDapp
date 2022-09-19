import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useField } from 'formik';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import SingleUserPicker, {
  SingleNFTPicker,
  filterUserSelection,
} from '~core/SingleUserPicker';
import { useMembersSubscription } from '~data/index';
import {
  getChainNameFromSafe,
  getIdFromNFTDisplayName,
  getTxServiceBaseUrl,
  SelectedNFT,
  SelectedSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { Address } from '~types/index';
import { log } from '~utils/debug';
import { SpinnerLoader } from '~core/Preloaders';

import { FormValues } from '../ControlSafeDialog';

import styles from './TransferNFTSection.css';

const MSG = defineMessages({
  selectNFT: {
    id: 'dashboard.ControlSafeDialog.TransferNFTSection.selectNFT',
    defaultMessage: 'Select the NFT held by the Safe',
  },
  NFTPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.NFTPickerPlaceholder`,
    defaultMessage: 'Select NFT to transfer',
  },
  selectRecipient: {
    id: 'dashboard.ControlSafeDialog.TransferNFTSection.selectRecipient',
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  contract: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.contract`,
    defaultMessage: 'Contract',
  },
  idLabel: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.idLabel`,
    defaultMessage: 'Id',
  },
  nftDetails: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.nftDetails`,
    defaultMessage: 'NFT details',
  },
  noNftsFound: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.noNftsFound`,
    defaultMessage: 'No NFTs found.',
  },
  nftLoading: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.nftLoading`,
    defaultMessage: 'Loading NFTs.',
  },
  nftError: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.nftError`,
    defaultMessage: 'Unable to fetch NFTs. Please check your connection.',
  },
});

const displayName = 'dashboard.ControlSafeDialog.TransferNFTSection';

interface Props {
  colonyAddress: Address;
  disabledInput: boolean;
  transactionFormIndex: number;
  values: FormValues;
  savedNFTs: [{}, React.Dispatch<React.SetStateAction<{ [x: string]: NFT[] }>>];
}

const renderAvatar = (address: string, item) => (
  <Avatar
    seed={address?.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.name}
    placeholderIcon="at-sign-circle"
  />
);

export interface NFT {
  address: string;
  description: string | null;
  id: string;
  imageUri: string | null;
  logoUri: string;
  metadata: object;
  name: string | null;
  tokenName: string;
  tokenSymbol: string;
  uri: string;
}

type NFTData = NFT[] | undefined | null;

const TransferNFTSection = ({
  colonyAddress,
  disabledInput,
  transactionFormIndex,
  values: { safe },
  savedNFTs: { '0': savedNFTs, '1': setSavedNFTs },
}: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const [availableNFTs, setAvailableNFTs] = useState<NFTData>(undefined);
  const [isLoadingNFTData, setIsLoadingNFTData] = useState<boolean>(false);

  const [{ value: selectedNFT }] = useField<SelectedNFT | null>(
    `transactions.${transactionFormIndex}.nft`,
  );

  const [
    { value: selectedNFTData },
    ,
    { setValue: setSelectedNFTData },
  ] = useField<NFT | null>(`transactions.${transactionFormIndex}.nftData`);

  useEffect(() => {
    const getNFTData = async () => {
      const getNFTs = async (
        chosenSafe: SelectedSafe,
      ): Promise<NFT[] | null> => {
        const chainName = getChainNameFromSafe(chosenSafe);
        const baseUrl = getTxServiceBaseUrl(chainName);
        try {
          const response = await fetch(
            `${baseUrl}/v1/safes/${chosenSafe.id}/collectibles/`,
          );
          if (response.status === 200) {
            const data = await response.json();
            return data;
          }
        } catch (e) {
          log.error(e);
        }
        return null;
      };
      if (safe) {
        const cachedNFTs = savedNFTs[safe.id];
        if (!cachedNFTs) {
          setIsLoadingNFTData(true);
          const nftData = await getNFTs(safe);
          setAvailableNFTs(nftData);
          if (nftData) {
            setSavedNFTs({
              ...savedNFTs,
              [safe.id]: nftData,
            });
          }
          setIsLoadingNFTData(false);
        } else {
          setAvailableNFTs(cachedNFTs);
        }
      }
    };
    getNFTData();
  }, [safe, savedNFTs, setSavedNFTs]);

  /*
   * This effect really belongs in the 'onSelected' prop of the SingleNFTPicker.
   * However, this causes a bug where Formik thinks the NFT is null, even though it isn't.
   */
  useEffect(() => {
    const filteredNFTData = availableNFTs?.find((nft) => {
      const id = getIdFromNFTDisplayName(
        selectedNFT?.profile.displayName || '',
      );
      return (
        nft.address === selectedNFT?.profile.walletAddress && nft.id === id
      );
    });
    if (filteredNFTData) {
      setSelectedNFTData(filteredNFTData);
    }

    if (!selectedNFT) {
      setSelectedNFTData(null);
    }
    /*
     * Including setSelectedNFTData creates an infinite loop,
     * presumably because it gets recreated on every re-render.
     */
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [selectedNFT, availableNFTs]);

  if (isLoadingNFTData) {
    return (
      <DialogSection>
        <div className={styles.loading}>
          <SpinnerLoader loadingText={MSG.nftLoading} />
        </div>
      </DialogSection>
    );
  }

  if (availableNFTs === null) {
    return (
      <DialogSection>
        <div className={styles.error}>
          <FormattedMessage {...MSG.nftError} />
        </div>
      </DialogSection>
    );
  }

  return availableNFTs?.length ? (
    <>
      {/* select NFT */}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.nftPicker}>
          <SingleNFTPicker
            appearance={{ width: 'wide' }}
            label={MSG.selectNFT}
            name={`transactions.${transactionFormIndex}.nft`}
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            data={availableNFTs || []}
            disabled={disabledInput}
            placeholder={MSG.NFTPickerPlaceholder}
          />
        </div>
      </DialogSection>
      {/* NFT details */}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.nftDetailsContainer}>
          <div className={styles.nftImageContainer}>
            <div className={styles.nftContentValue}>
              <FormattedMessage {...MSG.nftDetails} />
            </div>
            <div className={styles.nftImage}>
              <Avatar
                avatarURL={selectedNFTData?.imageUri || undefined}
                notSet={!selectedNFTData?.imageUri}
                seed={selectedNFTData?.address?.toLocaleLowerCase()}
                placeholderIcon="nft-icon"
                title="nftImage"
                size="l"
              />
            </div>
          </div>
          <div className={styles.nftDetails}>
            <div className={styles.nftLineItem}>
              <div className={styles.nftContentLabel}>
                <FormattedMessage {...MSG.contract} />
              </div>
              {selectedNFTData && (
                <div className={styles.nftContractContent}>
                  <Avatar
                    avatarURL={selectedNFTData.imageUri || undefined}
                    placeholderIcon="circle-close"
                    seed={selectedNFTData.address.toLocaleLowerCase()}
                    title=""
                    size="xs"
                    className={styles.nftContractAvatar}
                  />
                  {selectedNFTData.name || selectedNFTData.tokenName}
                </div>
              )}
            </div>
            <div className={styles.nftLineItem}>
              <div className={styles.nftContentLabel}>
                <FormattedMessage {...MSG.idLabel} />
              </div>
              {selectedNFTData && (
                <div className={styles.nftContentValue}>
                  {selectedNFTData.id}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogSection>
      {/* select recipient */}
      <DialogSection>
        <div className={styles.recipientPicker}>
          <SingleUserPicker
            appearance={{ width: 'wide' }}
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.selectRecipient}
            name={`transactions.${transactionFormIndex}.recipient`}
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={disabledInput}
            showMaskedAddress
            dataTest="NFTRecipientSelector"
            itemDataTest="NFTRecipientSelectorItem"
            valueDataTest="NFTRecipientName"
          />
        </div>
      </DialogSection>
    </>
  ) : (
    <DialogSection>
      <div className={styles.notFound}>
        <FormattedMessage {...MSG.noNftsFound} />
      </div>
    </DialogSection>
  );
};

TransferNFTSection.displayName = displayName;

export default TransferNFTSection;

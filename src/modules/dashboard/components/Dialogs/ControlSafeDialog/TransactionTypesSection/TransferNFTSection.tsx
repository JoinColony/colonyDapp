import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps, useField } from 'formik';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import SingleUserPicker, {
  SingleNFTPicker,
  filterUserSelection,
} from '~core/SingleUserPicker';
import { useMembersSubscription } from '~data/index';
import {
  getChainNameFromSafe,
  getTxServiceBaseUrl,
  SelectedNFT,
  SelectedSafe,
} from '~modules/dashboard/sagas/utils/safeHelpers';
import { getSelectedNFTData } from '~utils/safes';
import { Address } from '~types/index';
import { log } from '~utils/debug';
import { SpinnerLoader } from '~core/Preloaders';

import { FormValues, TransactionSectionProps } from '..';
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
    defaultMessage: 'No NFTs found',
  },
  nftLoading: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.nftLoading`,
    defaultMessage: 'Loading NFTs',
  },
  nftError: {
    id: `dashboard.ControlSafeDialog.TransferNFTSection.nftError`,
    defaultMessage: 'Unable to fetch NFTs. Please check your connection.',
  },
});

const displayName = 'dashboard.ControlSafeDialog.TransferNFTSection';

interface Props
  extends Omit<TransactionSectionProps, 'colony' | 'handleInputChange'> {
  colonyAddress: Address;
  savedNFTState: [
    {},
    React.Dispatch<React.SetStateAction<{ [x: string]: NFT[] }>>,
  ];
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
  savedNFTState,
  handleValidation,
}: Props & Pick<FormikProps<FormValues>, 'values'>) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const [savedNFTs, setSavedNFTs] = savedNFTState;
  const [availableNFTs, setAvailableNFTs] = useState<NFTData>(undefined);
  const [isLoadingNFTData, setIsLoadingNFTData] = useState<boolean>(false);

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
        const chainName = getChainNameFromSafe(chosenSafe.profile.displayName);
        const baseUrl = getTxServiceBaseUrl(chainName);
        try {
          const response = await fetch(
            `${baseUrl}/v1/safes/${chosenSafe.profile.walletAddress}/collectibles/`,
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
        const cachedNFTs = savedNFTs[safe.profile.walletAddress];
        if (!cachedNFTs) {
          setIsLoadingNFTData(true);
          const nftData = await getNFTs(safe);
          setAvailableNFTs(nftData);
          if (nftData) {
            setSavedNFTs({
              ...savedNFTs,
              [safe.profile.walletAddress]: nftData,
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

  if (isLoadingNFTData) {
    return (
      <DialogSection>
        <div className={styles.loading}>
          <SpinnerLoader
            appearance={{ size: 'medium' }}
            loadingText={MSG.nftLoading}
          />
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
            data={availableNFTs}
            disabled={disabledInput}
            placeholder={MSG.NFTPickerPlaceholder}
            validateOnChange
            onSelected={(selectedNFT: SelectedNFT) => {
              const nftData = getSelectedNFTData(selectedNFT, availableNFTs);

              // selectedNFT comes from availableNFTs, so getSelectedNFTData won't return undefined (it's using .find())
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setSelectedNFTData(nftData!, false); // setting true causes bug
              handleValidation();
            }}
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
                  <div className={styles.nftName}>
                    {selectedNFTData.name || selectedNFTData.tokenName}
                  </div>
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
            data={colonyMembers?.subscribedUsers || []}
            label={MSG.selectRecipient}
            name={`transactions.${transactionFormIndex}.recipient`}
            filter={filterUserSelection}
            renderAvatar={renderAvatar}
            placeholder={MSG.userPickerPlaceholder}
            disabled={disabledInput}
            dataTest="NFTRecipientSelector"
            itemDataTest="NFTRecipientSelectorItem"
            valueDataTest="NFTRecipientName"
            validateOnChange
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

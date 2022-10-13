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
import { Address, Message } from '~types/index';
import { log } from '~utils/debug';

import { FormValues, TransactionSectionProps, SafeTransaction } from '..';
import { MSG as FundsMSG } from './TransferFundsSection';
import { UserAvatarXs, ErrorMessage as Error, Loading } from './shared';

import styles from './TransferNFTSection.css';

const MSG = defineMessages({
  selectNFT: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.selectNFT`,
    defaultMessage: 'Select the NFT held by the Safe',
  },
  NFTPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.NFTPickerPlaceholder`,
    defaultMessage: 'Select NFT to transfer',
  },
  selectRecipient: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.selectRecipient`,
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  contract: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.contract`,
    defaultMessage: 'Contract',
  },
  idLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.idLabel`,
    defaultMessage: 'Id',
  },
  nftDetails: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.nftDetails`,
    defaultMessage: 'NFT details',
  },
  noNftsFound: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.noNftsFound`,
    defaultMessage: 'No NFTs found',
  },
  nftLoading: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.nftLoading`,
    defaultMessage: 'Loading NFTs',
  },
  nftError: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection.nftError`,
    defaultMessage: 'Unable to fetch NFTs. Please check your connection',
  },
});

const displayName = `dashboard.ControlSafeDialog.ControlSafeForm.TransactionTypesSection.TransferNFTSection`;

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
  const [availableNFTs, setAvailableNFTs] = useState<NFT[]>();
  const [nftError, setNFTError] = useState<Message>('');
  const [isLoadingNFTData, setIsLoadingNFTData] = useState<boolean>(false);
  const [
    { value: selectedNFTData },
    ,
    { setValue: setSelectedNFTData },
  ] = useField<SafeTransaction['nftData']>(
    `transactions.${transactionFormIndex}.nftData`,
  );

  /*
   * So the form shows loading spinner when entering from main menu
   * but not when clicking "back" from preview
   */
  const isFirstFetch = safe && !availableNFTs && !nftError && !selectedNFTData;

  useEffect(() => {
    const getNFTs = async (chosenSafe: SelectedSafe): Promise<void> => {
      setNFTError('');
      setIsLoadingNFTData(true);
      const chainName = getChainNameFromSafe(chosenSafe.profile.displayName);
      const baseUrl = getTxServiceBaseUrl(chainName);
      const address = chosenSafe.profile.walletAddress;
      try {
        const response = await fetch(
          `${baseUrl}/v1/safes/${address}/collectibles/`,
        );
        if (response.status === 200) {
          const data = await response.json();
          setSavedNFTs((nfts) => ({
            ...nfts,
            [address]: data,
          }));
          setAvailableNFTs(data);
        }
      } catch (e) {
        log.error(e);
        setNFTError(MSG.nftError);
      } finally {
        setIsLoadingNFTData(false);
      }
    };

    if (safe) {
      const savedNFTData = savedNFTs[safe.profile.walletAddress];
      if (savedNFTData) {
        setNFTError('');
        setAvailableNFTs(savedNFTData);
      } else {
        getNFTs(safe);
      }
      handleValidation();
    }
  }, [safe, savedNFTs, setSavedNFTs, handleValidation]);

  if (!safe && !availableNFTs && !nftError) {
    return <Error error={FundsMSG.noSafeSelectedError} />;
  }

  if (isLoadingNFTData || isFirstFetch) {
    return <Loading message={MSG.nftLoading} />;
  }

  if (nftError) {
    return <Error error={nftError} />;
  }

  if (availableNFTs?.length === 0) {
    return <Error error={MSG.noNftsFound} />;
  }

  return (
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
            validateOnChange
            onSelected={(selectedNFT: SelectedNFT) => {
              const nftData = getSelectedNFTData(
                selectedNFT,
                availableNFTs || [],
              );

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
            renderAvatar={UserAvatarXs}
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
  );
};

TransferNFTSection.displayName = displayName;

export default TransferNFTSection;

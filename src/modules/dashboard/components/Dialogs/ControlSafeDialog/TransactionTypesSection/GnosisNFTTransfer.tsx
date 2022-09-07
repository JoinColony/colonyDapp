import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Avatar from '~core/Avatar';
import { DialogSection } from '~core/Dialog';
import SingleUserPicker, {
  SingleNFTPicker,
  filterUserSelection,
} from '~core/SingleUserPicker';

import { useMembersSubscription } from '~data/index';

import { Address } from '~types/index';
import { NFT } from '~dashboard/Dialogs/ControlSafeDialog';

import styles from './GnosisNFTTransfer.css';

const MSG = defineMessages({
  selectNFT: {
    id: 'dashboard.ControlSafeDialog.GnosisNFTTransfer.selectNFT',
    defaultMessage: 'Select the NFT held by the Safe',
  },
  NFTPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.GnosisNFTTransfer.NFTPickerPlaceholder`,
    defaultMessage: 'Select NFT to transfer',
  },
  selectRecipient: {
    id: 'dashboard.ControlSafeDialog.GnosisNFTTransfer.selectRecipient',
    defaultMessage: 'Select Recipient',
  },
  userPickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.GnosisNFTTransfer.userPickerPlaceholder`,
    defaultMessage: 'Search for a user or paste wallet address',
  },
  contract: {
    id: `dashboard.ControlSafeDialog.GnosisNFTTransfer.contract`,
    defaultMessage: 'Contract',
  },
  idLabel: {
    id: `dashboard.ControlSafeDialog.GnosisNFTTransfer.idLabel`,
    defaultMessage: 'Id',
  },
  nftDetails: {
    id: `dashboard.ControlSafeDialog.GnosisNFTTransfer.nftDetails`,
    defaultMessage: 'NFT details',
  },
});

const displayName = 'dashboard.ControlSafeDialog.GnosisNFTTransfer';

interface Props {
  colonyAddress: Address;
  disabledInput: boolean;
  nftCatalogue: NFT[];
  transactionFormIndex: number;
  values;
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

const GnosisNFTTransfer = ({
  colonyAddress,
  disabledInput,
  nftCatalogue,
  transactionFormIndex,
  values,
}: Props) => {
  const { data: colonyMembers } = useMembersSubscription({
    variables: { colonyAddress },
  });

  const filteredNFTData = useMemo(
    () =>
      nftCatalogue.find(
        (item) =>
          item?.address === values?.transactions[transactionFormIndex]?.nft?.id,
      ),
    [nftCatalogue, transactionFormIndex, values],
  );

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
            data={nftCatalogue}
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
                avatarURL={undefined}
                notSet={!filteredNFTData?.avatar}
                seed={filteredNFTData?.address?.toLocaleLowerCase()}
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
              {filteredNFTData && (
                <div className={styles.nftContractContent}>
                  <Avatar
                    avatarURL={undefined}
                    placeholderIcon="circle-close"
                    seed={filteredNFTData?.address?.toLocaleLowerCase()}
                    title=""
                    size="xs"
                    className={styles.nftContractAvatar}
                  />
                  {filteredNFTData.name}
                </div>
              )}
            </div>
            <div className={styles.nftLineItem}>
              <div className={styles.nftContentLabel}>
                <FormattedMessage {...MSG.idLabel} />
              </div>
              <div className={styles.nftContentValue}>
                {filteredNFTData?.tokenID}
              </div>
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
  );
};

GnosisNFTTransfer.displayName = displayName;

export default GnosisNFTTransfer;

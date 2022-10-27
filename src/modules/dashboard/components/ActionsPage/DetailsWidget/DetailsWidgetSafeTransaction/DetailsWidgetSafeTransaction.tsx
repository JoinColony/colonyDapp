import React, { useState } from 'react';
import classnames from 'classnames';
import { defineMessage, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import Numeral from '~core/Numeral';
import Avatar from '~core/Avatar';
import { Colony } from '~data/index';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';

import { SafeInfo } from '../DetailsWidget';
import {
  ContractName,
  ContractSection,
  FunctionsSection,
  nftMSG,
  Recipient,
  Title,
  Value,
} from './components';

import widgetStyles from '../DetailsWidget.css';
import styles from './DetailsWidgetSafeTransaction.css';

const displayName = `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction`;

const MSG = defineMessage({
  transferFunds: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.transferFunds`,
    defaultMessage: 'Transfer funds',
  },
  transferNFT: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.transferNFT`,
    defaultMessage: 'Transfer NFT',
  },
  tokenId: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.tokenId`,
    defaultMessage: 'Token Id',
  },
  contractInteraction: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.contractInteraction`,
    defaultMessage: 'Contract Interaction',
  },
  rawTransaction: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.rawTransaction`,
    defaultMessage: 'Raw Transaction',
  },
  value: {
    id:
      'dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.value',
    defaultMessage: 'Value (wei)',
  },
  data: {
    id: 'dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.data',
    defaultMessage: 'Data',
  },
});

interface Props {
  safeInfo: SafeInfo;
  colony: Colony;
}

const DetailsWidgetSafeTransaction = ({
  safeInfo: { safeTransactions, safe },
  colony,
}: Props) => (
  <div className={styles.main}>
    {safeTransactions.map((transaction, index, transactions) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isOpen, setIsOpen] = useState(true);
      const idx = transactions.length > 1 ? index + 1 : null;
      const token = transaction.tokenData;
      const NFT = transaction.nftData;

      const renderWidget = () => {
        switch (transaction.transactionType) {
          case TransactionTypes.TRANSFER_FUNDS:
            return (
              <>
                <Title
                  index={idx}
                  title={MSG.transferFunds}
                  {...{ isOpen, setIsOpen }}
                />
                {isOpen && (
                  <>
                    <ContractSection transaction={transaction} safe={safe} />
                    {transaction.recipient && (
                      <Recipient
                        recipient={transaction.recipient}
                        colony={colony}
                      />
                    )}
                    {transaction.amount && token && (
                      <Value transaction={transaction} token={token} />
                    )}
                  </>
                )}
              </>
            );
          case TransactionTypes.TRANSFER_NFT:
            return (
              <>
                <Title
                  index={idx}
                  title={MSG.transferNFT}
                  {...{ isOpen, setIsOpen }}
                />
                {isOpen && (
                  <>
                    <ContractSection transaction={transaction} safe={safe} />
                    {transaction.recipient && (
                      <Recipient
                        recipient={transaction.recipient}
                        colony={colony}
                      />
                    )}
                    {transaction.amount && token && (
                      <Value transaction={transaction} token={token} />
                    )}
                    {NFT && (
                      <div className={widgetStyles.item}>
                        <div className={widgetStyles.label}>
                          <FormattedMessage {...MSG.tokenId} />
                        </div>
                        <div className={widgetStyles.value}>
                          <span>{NFT.id}</span>
                        </div>
                      </div>
                    )}
                    <div className={widgetStyles.item}>
                      <div className={widgetStyles.label}>
                        <FormattedMessage {...nftMSG} />
                      </div>
                      <div className={styles.nft}>
                        <div className={widgetStyles.value}>
                          <span title={transaction.nft?.profile.displayName}>
                            {transaction.nft?.profile.displayName}
                          </span>
                        </div>
                        <Avatar
                          notSet={!NFT?.imageUri}
                          avatarURL={NFT?.imageUri || undefined}
                          seed={NFT?.address?.toLocaleLowerCase()}
                          placeholderIcon="nft-icon"
                          title="nftImage"
                          size="s"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            );
          case TransactionTypes.CONTRACT_INTERACTION:
            return (
              <>
                <Title
                  index={idx}
                  title={MSG.contractInteraction}
                  {...{ isOpen, setIsOpen }}
                />
                {isOpen && (
                  <>
                    <ContractSection
                      transaction={transaction}
                      safe={safe}
                      hideFunctionContract
                    />
                    <FunctionsSection transaction={transaction} />
                  </>
                )}
              </>
            );
          case TransactionTypes.RAW_TRANSACTION:
            return (
              <>
                <Title
                  index={idx}
                  title={MSG.rawTransaction}
                  {...{ isOpen, setIsOpen }}
                />
                {isOpen && (
                  <>
                    <ContractName
                      // Eslint erroneously flagging as missing in props validation
                      /* eslint-disable react/prop-types */
                      name={safe.safeName}
                      address={safe.contractAddress}
                      /* eslint-enable react/prop-types */
                    />
                    {transaction.recipient && (
                      <Recipient
                        recipient={transaction.recipient}
                        colony={colony}
                      />
                    )}
                    {transaction.rawAmount && (
                      <div className={styles.value}>
                        <div className={widgetStyles.item}>
                          <div className={widgetStyles.label}>
                            <FormattedMessage {...MSG.value} />
                          </div>
                          <div className={widgetStyles.value}>
                            <Numeral
                              value={transaction.rawAmount}
                              title={transaction.rawAmount}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {transaction.data && (
                      <div className={styles.data}>
                        <div className={widgetStyles.item}>
                          <div className={widgetStyles.label}>
                            <FormattedMessage {...MSG.data} />
                          </div>
                          <div className={widgetStyles.value}>
                            <span>{transaction.data}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            );
          default:
            return null;
        }
      };
      return (
        <section
          key={nanoid()}
          className={classnames({
            [styles.sectionOpen]: isOpen,
          })}
        >
          {renderWidget()}
        </section>
      );
    })}
  </div>
);

DetailsWidgetSafeTransaction.displayName = displayName;
export default DetailsWidgetSafeTransaction;

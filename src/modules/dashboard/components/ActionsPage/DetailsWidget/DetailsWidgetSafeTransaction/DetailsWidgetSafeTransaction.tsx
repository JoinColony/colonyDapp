import React, { useState } from 'react';
import classnames from 'classnames';
import { defineMessage, FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';

import Numeral from '~core/Numeral';
import Avatar from '~core/Avatar';
import { Colony, ColonySafe, SafeTransaction } from '~data/index';
import {
  TransactionTypes,
  MSG as TypesMSG,
} from '~dashboard/Dialogs/ControlSafeDialog/constants';

import {
  ContractName,
  ContractSection,
  nftMSG,
  Recipient,
  Title,
  Value,
} from '../DetailsWidgetSafeTransaction';
/*
  @NOTE: For some reason, this import and a few others have started crashing the Dapp
  when they were working preflecty fine before. 
  The solution for now has been to be really specific with the route. 
*/
import FunctionsSection from '../DetailsWidgetSafeTransaction/components/FunctionsSection';

import widgetStyles from '../DetailsWidget.css';
import styles from './DetailsWidgetSafeTransaction.css';

const displayName = `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction`;

const MSG = defineMessage({
  tokenId: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.tokenId`,
    defaultMessage: 'Token Id',
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
  safe: ColonySafe;
  safeTransactions: SafeTransaction[];
  colony: Colony;
}

const DetailsWidgetSafeTransaction = ({
  safe,
  safeTransactions,
  colony,
}: Props) => {
  const [openWidgets, setOpenWidgets] = useState<boolean[]>(
    new Array(safeTransactions.length).fill(true),
  );
  return (
    <div className={styles.main}>
      {safeTransactions.map((transaction, index, transactions) => {
        const setIsOpen = () => {
          setOpenWidgets((widgets) => {
            const updated = [...widgets];
            updated[index] = !updated[index];
            return updated;
          });
        };
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
                    title={TypesMSG.transferFunds}
                    {...{
                      isOpen: openWidgets[index],
                      setIsOpen,
                    }}
                  />
                  {openWidgets[index] && (
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
                    title={TypesMSG.transferNft}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
                    <>
                      <ContractSection transaction={transaction} safe={safe} />
                      {transaction.recipient && (
                        <Recipient
                          recipient={transaction.recipient}
                          colony={colony}
                        />
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
                    title={TypesMSG.contractInteraction}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
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
                    title={TypesMSG.rawTransaction}
                    {...{ isOpen: openWidgets[index], setIsOpen }}
                  />
                  {openWidgets[index] && (
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
              [styles.sectionOpen]: openWidgets[index],
            })}
          >
            {renderWidget()}
          </section>
        );
      })}
    </div>
  );
};

DetailsWidgetSafeTransaction.displayName = displayName;
export default DetailsWidgetSafeTransaction;

import { Placement } from '@popperjs/core';
import React from 'react';
import { defineMessage, FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';
import { nanoid } from 'nanoid';

import DetailsWidgetUser from '~core/DetailsWidgetUser';
import Icon from '~core/Icon';
import InvisibleCopyableAddress from '~core/InvisibleCopyableAddress';
import MaskedAddress from '~core/MaskedAddress';
import Avatar from '~core/Avatar';
import Numeral from '~core/Numeral';
import AddressDetailsView from '~dashboard/Dialogs/ControlSafeDialog/TransactionPreview/AddressDetailsView';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import { defaultTransaction } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import {
  SafeTransaction,
  ColonySafe,
  SafeBalanceToken,
  Erc20Token,
} from '~data/generated';
import { AnyUser, Colony } from '~data/index';
import { intl } from '~utils/intl';
import { getArrayFromString } from '~utils/safes';
import {
  extractParameterName,
  extractParameterType,
} from '~utils/safes/getContractUsefulMethods';
import { omit } from '~utils/lodash';

import { toRecipientMSG, valueMSG } from '../DetailsWidget';

import widgetStyles from '../DetailsWidget.css';
import styles from './DetailsWidgetSafeTransaction.css';

const MSG = defineMessage({
  contract: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.contract`,
    defaultMessage: 'Contract',
  },
  unknownContract: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.unknownContract`,
    defaultMessage: 'Unknown contract',
  },
  token: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.token`,
    defaultMessage: 'Token',
  },
  nft: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.nft`,
    defaultMessage: 'NFT',
  },
  function: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.function`,
    defaultMessage: 'Function',
  },
  functionContract: {
    id: `dashboard.ActionsPage.DetailsWidget.DetailsWidgetSafeTransaction.components.functionContract`,
    defaultMessage: 'Function contract',
  },
});

export const { unknownContract: unknownContractMSG, nft: nftMSG } = MSG;

interface ContractNameProps {
  name: string;
  address: string;
  showMaskedAddress?: boolean;
}

export const ContractName = ({ name, address }: ContractNameProps) => (
  <div className={classnames(widgetStyles.item, styles.contractItem)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...MSG.contract} />
    </div>
    <div className={widgetStyles.value}>
      <Avatar
        seed={address.toLowerCase()}
        title="contractAddressAvatar"
        placeholderIcon="gnosis-logo"
      />
      <div className={styles.contractAddress}>
        <span>{name}</span>
      </div>
    </div>
  </div>
);

interface ContractSectionProps {
  transaction: SafeTransaction;
  safe: ColonySafe;
  hideFunctionContract?: boolean;
}

export const ContractSection = ({
  transaction,
  safe,
  hideFunctionContract,
}: ContractSectionProps) => {
  const functionContract =
    transaction.contract?.id ||
    transaction.tokenData?.address ||
    transaction.nftData?.address;

  const getContractInfo = (safeTransaction: SafeTransaction) => {
    const { formatMessage } = intl;
    const { transactionType } = safeTransaction;
    const contractInfo = {
      contractName: safe.safeName,
      contractAddress: safe.contractAddress,
    };

    switch (transactionType) {
      case TransactionTypes.TRANSFER_NFT:
        contractInfo.contractName =
          safeTransaction.nftData?.name ||
          safeTransaction.nftData?.tokenName ||
          formatMessage(MSG.nft);
        contractInfo.contractAddress =
          safeTransaction.nftData?.address || safe.contractAddress;
        break;
      case TransactionTypes.TRANSFER_FUNDS:
        contractInfo.contractName =
          safeTransaction.tokenData?.name || formatMessage(MSG.token);
        contractInfo.contractAddress =
          safeTransaction.tokenData?.address || safe.contractAddress;
        break;
      case TransactionTypes.CONTRACT_INTERACTION:
        contractInfo.contractName =
          safeTransaction.contract?.profile.displayName ||
          formatMessage(MSG.unknownContract);
        contractInfo.contractAddress =
          safeTransaction.contract?.profile.walletAddress ||
          safe.contractAddress;
        break;
      default:
        break;
    }

    return contractInfo;
  };

  const { contractName, contractAddress } = getContractInfo(transaction);

  return (
    <>
      <ContractName name={contractName} address={contractAddress} />
      {transaction.contractFunction && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.function} />
          </div>
          <div className={widgetStyles.value}>
            <span>{transaction.contractFunction}</span>
          </div>
        </div>
      )}
      {functionContract && !hideFunctionContract && (
        <div className={widgetStyles.item}>
          <div className={widgetStyles.label}>
            <FormattedMessage {...MSG.functionContract} />
          </div>
          <div className={widgetStyles.value}>
            <InvisibleCopyableMaskedAddress address={functionContract} />
          </div>
        </div>
      )}
    </>
  );
};

interface DefaultArgumentProps {
  argument: string;
}

const DefaultArgument = ({ argument }: DefaultArgumentProps) => (
  <span title={argument} className={styles.functionArg}>
    {argument}
  </span>
);

type FunctionsSectionProps = Pick<ContractSectionProps, 'transaction'>;

export const FunctionsSection = ({ transaction }: FunctionsSectionProps) => {
  const functions = Object.entries(
    omit(transaction, Object.keys(defaultTransaction)),
  );

  const formatArgument = (
    type: string,
    argument: string,
    isArrayType: boolean,
  ) => {
    // only display first level of array
    const getFormattedArray = (
      paramType: string,
      fnArgument: string,
    ): string | JSX.Element[] => {
      if (fnArgument[0] !== '[' || fnArgument[fnArgument.length - 1] !== ']') {
        return fnArgument;
      }

      const arg = getArrayFromString(fnArgument);
      return arg.map((item) => {
        // If array is nesting one or more other arrays
        if (item[0] === '[' && item[item.length - 1] === ']') {
          return <DefaultArgument argument={item} key={nanoid()} />;
        }
        return formatArgument(paramType, item, false) as JSX.Element;
      });
    };

    if (isArrayType) {
      const formattedArgs = getFormattedArray(type, argument);
      if (!Array.isArray(formattedArgs)) {
        return <DefaultArgument argument={formattedArgs} key={nanoid()} />;
      }

      return formattedArgs.map((element, idx) => {
        return (
          <div className={styles.arrayItem} key={nanoid()}>
            <div className={widgetStyles.label}>
              <span>
                <Numeral value={idx} />:
              </span>
            </div>
            <div className={widgetStyles.value}>{element}</div>
          </div>
        );
      });
    }

    switch (true) {
      case type.includes('address'):
        return (
          <InvisibleCopyableMaskedAddress
            address={argument.trim()}
            key={nanoid()}
          />
        );
      case type.includes('int'):
        return <Numeral value={argument} key={nanoid()} />;
      default:
        return <DefaultArgument argument={argument} key={nanoid()} />;
    }
  };

  return (
    <>
      {functions.map(([parameter, argument], i) => {
        const paramName = extractParameterName(
          parameter,
          transaction.contractFunction,
          transaction.functionParamTypes?.[i],
        );
        const paramType = extractParameterType(paramName);
        const isArrayType = paramType.substring(paramType.length - 2) === '[]';

        return (
          <div className={widgetStyles.item} key={nanoid()}>
            <div className={widgetStyles.label}>
              <span>{paramName}</span>
            </div>
            <div
              className={classnames(widgetStyles.value, {
                [styles.arrayContainer]: isArrayType,
              })}
            >
              {formatArgument(paramType, argument as string, isArrayType)}
            </div>
          </div>
        );
      })}
    </>
  );
};

interface RecipientProps {
  recipient: AnyUser;
  colony: Colony;
}

export const Recipient = ({ recipient, colony }: RecipientProps) => (
  <div className={classnames(widgetStyles.item, styles.recipient)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...toRecipientMSG} />
    </div>
    <div className={widgetStyles.value}>
      {recipient.id === 'filterValue' ? (
        <AddressDetailsView item={recipient} isSafeItem={false} isCopyable />
      ) : (
        <DetailsWidgetUser
          colony={colony}
          walletAddress={recipient.profile.walletAddress}
        />
      )}
    </div>
  </div>
);

const renderTokenIcon = (tokenData: SafeBalanceToken) => {
  const isERC20Token = (token: SafeBalanceToken): token is Erc20Token => {
    if ('logoUri' in token) {
      return true;
    }

    return false;
  };

  if (tokenData.name === 'Ether') {
    return <Icon className={styles.ether} name="ether" title="Ether Logo" />;
  }

  if (isERC20Token(tokenData)) {
    return (
      <Avatar
        avatarURL={tokenData.logoUri}
        notSet={!tokenData.logoUri}
        title={`${tokenData.name} token logo`}
        placeholderIcon="circle-close"
        seed={tokenData.address.toLowerCase()}
      />
    );
  }

  return (
    <Avatar
      notSet
      title={tokenData.name}
      placeholderIcon="circle-close"
      seed={tokenData.address.toLowerCase()}
    />
  );
};

interface ValueProps {
  transaction: SafeTransaction;
  token: SafeBalanceToken;
}

export const Value = ({ transaction, token }: ValueProps) => (
  <div className={classnames(widgetStyles.item, styles.tokenValue)}>
    <div className={widgetStyles.label}>
      <FormattedMessage {...valueMSG} />
    </div>
    {token && transaction.amount && (
      <div className={styles.tokenContainer}>
        {renderTokenIcon(token)}
        <div className={widgetStyles.value}>
          <Numeral value={transaction.amount} />
          <span>{token.symbol}</span>
        </div>
      </div>
    )}
  </div>
);

interface TitleProps {
  index: number | null;
  title: MessageDescriptor;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Title = ({ index, title, isOpen, setIsOpen }: TitleProps) => (
  <div className={classnames(widgetStyles.item, styles.title)}>
    <div className={widgetStyles.label}>
      {index && `${index}. `}
      <FormattedMessage {...title} />
    </div>
    <div className={widgetStyles.value}>
      <Icon
        name={isOpen ? 'caret-up' : 'caret-down'}
        appearance={{ size: 'extraTiny' }}
        onClick={() => setIsOpen((val) => !val)}
      />
    </div>
  </div>
);

interface InvisibleCopyableMaskedAddressProps {
  address: string;
  tooltipPlacement?: Placement;
}

export const InvisibleCopyableMaskedAddress = ({
  address,
  tooltipPlacement = 'right',
}: InvisibleCopyableMaskedAddressProps) => (
  <InvisibleCopyableAddress
    address={address}
    tooltipPlacement={tooltipPlacement}
  >
    <MaskedAddress address={address} />
  </InvisibleCopyableAddress>
);

import { defineMessages } from 'react-intl';

export enum TransactionTypes {
  TRANSFER_FUNDS = 'transferFunds',
  TRANSFER_NFT = 'transferNft',
  CONTRACT_INTERACTION = 'contractInteraction',
  RAW_TRANSACTION = 'rawTransaction',
}
const MSG = defineMessages({
  [TransactionTypes.TRANSFER_FUNDS]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.TRANSFER_FUNDS}`,
    defaultMessage: 'Transfer funds',
  },
  [TransactionTypes.TRANSFER_NFT]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.TRANSFER_NFT}`,
    defaultMessage: 'Transfer NFT',
  },
  [TransactionTypes.CONTRACT_INTERACTION]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.CONTRACT_INTERACTION}`,
    defaultMessage: 'Contract interaction',
  },
  [TransactionTypes.RAW_TRANSACTION]: {
    id: `dashboard.GnosisControlSafeDialog.GnosisControlSafeForm.${TransactionTypes.RAW_TRANSACTION}`,
    defaultMessage: 'Raw transaction',
  },
});

export const transactionOptions = [
  {
    value: TransactionTypes.TRANSFER_FUNDS,
    label: MSG[TransactionTypes.TRANSFER_FUNDS],
    labelString: 'Transfer funds',
  },
  {
    value: TransactionTypes.TRANSFER_NFT,
    label: MSG[TransactionTypes.TRANSFER_NFT],
    labelString: 'Transfer NFT',
  },
  {
    value: TransactionTypes.CONTRACT_INTERACTION,
    label: MSG[TransactionTypes.CONTRACT_INTERACTION],
    labelString: 'Contract interaction',
  },
  {
    value: TransactionTypes.RAW_TRANSACTION,
    label: MSG[TransactionTypes.RAW_TRANSACTION],
    labelString: 'Raw transaction',
  },
];

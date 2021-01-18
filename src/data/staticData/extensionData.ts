import { defineMessages, MessageDescriptor } from 'react-intl';
import { ColonyRole, Extension } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import * as yup from 'yup';

import { Address } from '~types/index';

export interface ExtensionInitParams {
  title: string | MessageDescriptor;
  description: string | MessageDescriptor;
  defaultValue: string | number;
  paramName: string;
  validation: object;
}

export interface ExtensionData {
  address?: Address;
  extensionId: Extension | 'Unknown';
  name: string | MessageDescriptor;
  descriptionShort: string | MessageDescriptor;
  descriptionLong: string | MessageDescriptor;
  currentVersion: number;
  createdAt: number;
  neededColonyPermissions: ColonyRole[];
  initializationParams?: ExtensionInitParams[];
  uninstallable: boolean;
}

const MSG = defineMessages({
  oneTxPaymentName: {
    id: 'extensions.OneTxPayment.name',
    defaultMessage: 'One Transaction Payment',
  },
  oneTxPaymentDescriptionShort: {
    id: 'extensions.OneTxPayment.description',
    defaultMessage: 'Pay a single account one type of token.',
  },
  oneTxPaymentDescriptionLong: {
    id: 'extensions.OneTxPayment.descriptionLong',
    defaultMessage: 'Pay a single account one type of token.',
  },
  coinMachineName: {
    id: 'extensions.CoinMachine.name',
    defaultMessage: 'Coin Machine',
  },
  coinMachineDescriptionShort: {
    id: 'extensions.CoinMachine.descriptionShort',
    defaultMessage: 'A simple way to continually sell tokens.',
  },
  coinMachineDescriptionLong: {
    id: 'extensions.CoinMachine.descriptionLong',
    defaultMessage: 'A simple way to continually sell tokens.',
  },
  coinMachinePurchaseTokenTitle: {
    id: 'extensions.CoinMachine.param.purchaseToken.title',
    defaultMessage: 'Purchase Token',
  },
  coinMachinePurchaseTokenDescription: {
    id: 'extensions.CoinMachine.param.purchaseToken.description',
    defaultMessage: 'The token to receive payments in. Use 0x0 for ether',
  },
  coinMachinePeriodLengthTitle: {
    id: 'extensions.CoinMachine.param.periodLength.title',
    defaultMessage: 'Period Length',
  },
  coinMachinePeriodLengthDescription: {
    id: 'extensions.CoinMachine.param.periodLength.description',
    defaultMessage: 'How long in seconds each period of the sale should last',
  },
  coinMachineWindowSizeTitle: {
    id: 'extensions.CoinMachine.param.windowSize.title',
    defaultMessage: 'Window Size',
  },
  coinMachineWindowSizeDescription: {
    id: 'extensions.CoinMachine.param.windowSize.description',
    defaultMessage: `Characteristic number of periods that should be used for the moving average. In the long-term, 86% of the weighting will be in this window size. The higher the number, the slower the price will be to adjust`,
  },
  coinMachineTargetPerPeriodTitle: {
    id: 'extensions.CoinMachine.param.targetPerPeriod.title',
    defaultMessage: 'Target Per Period',
  },
  coinMachineTargetPerPeriodDescription: {
    id: 'extensions.CoinMachine.param.targetPerPeriod.description',
    defaultMessage: 'The number of tokens to aim to sell per period',
  },
  coinMachineMaxPerPeriodTitle: {
    id: 'extensions.CoinMachine.param.maxPerPeriod.title',
    defaultMessage: 'Maximum Per Period',
  },
  coinMachineMaxPerPeriodDescription: {
    id: 'extensions.CoinMachine.param.maxPerPeriod.description',
    defaultMessage: 'The maximum number of tokens that can be sold per period',
  },
  coinMachineStartingPriceTitle: {
    id: 'extensions.CoinMachine.param.startingPriceTitle.title',
    defaultMessage: 'Starting Price',
  },
  coinMachineStartingPriceDescription: {
    id: 'extensions.CoinMachine.param.startingPriceTitle.description',
    defaultMessage: `The sale price to start at, expressed in units of the Purchase Token per token being sold, as a WAD`,
  },
  unknownName: {
    id: 'extensions.Unknown.name',
    defaultMessage: 'Unknown Extension',
  },
  unknownDescription: {
    id: 'extensions.Unknown.description',
    defaultMessage: 'I do not know this extension',
  },
});

const extensions: { [key: string]: ExtensionData } = {
  OneTxPayment: {
    extensionId: Extension.OneTxPayment,
    name: MSG.oneTxPaymentName,
    descriptionShort: MSG.oneTxPaymentDescriptionShort,
    descriptionLong: MSG.oneTxPaymentDescriptionLong,
    currentVersion: 1,
    createdAt: 1557698400000,
    neededColonyPermissions: [ColonyRole.Administration, ColonyRole.Funding],
    uninstallable: false,
  },
  CoinMachine: {
    extensionId: Extension.CoinMachine,
    name: MSG.coinMachineName,
    descriptionShort: MSG.coinMachineDescriptionShort,
    descriptionLong: MSG.coinMachineDescriptionLong,
    currentVersion: 1,
    createdAt: 1603915271852,
    neededColonyPermissions: [ColonyRole.Root],
    initializationParams: [
      {
        paramName: 'purchaseToken',
        validation: yup.string().required(),
        defaultValue: AddressZero,
        title: MSG.coinMachinePurchaseTokenTitle,
        description: MSG.coinMachinePurchaseTokenDescription,
      },
      {
        paramName: 'periodLength',
        validation: yup.number().required(),
        title: MSG.coinMachinePeriodLengthTitle,
        description: MSG.coinMachinePeriodLengthDescription,
        defaultValue: 3600,
      },
      {
        paramName: 'windowSize',
        validation: yup.number().required(),
        title: MSG.coinMachineWindowSizeTitle,
        description: MSG.coinMachineWindowSizeDescription,
        defaultValue: 8,
      },
      {
        paramName: 'targetPerPeriod',
        validation: yup.number().required(),
        title: MSG.coinMachineTargetPerPeriodTitle,
        description: MSG.coinMachineTargetPerPeriodDescription,
        defaultValue: 10,
      },
      {
        paramName: 'maxPerPeriod',
        validation: yup.number().required(),
        title: MSG.coinMachineMaxPerPeriodTitle,
        description: MSG.coinMachineMaxPerPeriodDescription,
        defaultValue: 10,
      },
      {
        paramName: 'startingPrice',
        validation: yup.number().required(),
        title: MSG.coinMachineStartingPriceTitle,
        description: MSG.coinMachineStartingPriceDescription,
        defaultValue: 10,
      },
    ],
    uninstallable: true,
  },
  Unknown: {
    extensionId: 'Unknown',
    createdAt: 0,
    name: MSG.unknownName,
    descriptionShort: MSG.unknownDescription,
    descriptionLong: MSG.unknownDescription,
    currentVersion: 0,
    neededColonyPermissions: [],
    uninstallable: false,
  },
};

export default extensions;

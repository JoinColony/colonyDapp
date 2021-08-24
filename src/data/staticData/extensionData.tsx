import React, { ReactNode, ReactElement } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
} from 'react-intl';
import { ColonyRole, Extension } from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import * as yup from 'yup';

import Whitelist from '~dashboard/Whitelist';
import { Address } from '~types/index';
import { CustomRadioProps } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import { Colony } from '~data/index';

export interface ExtensionBodyProps {
  colony: Colony;
}

export enum ExtensionParamType {
  Input = 'Input',
  Radio = 'Radio',
  Textarea = 'Textarea',
  ColonyPolicySelector = 'ColonyPolicySelector',
  TokenSymbolSelector = 'TokenSymbolSelector',
}

export enum PolicyType {
  KycOnly = 0,
  AgreementOnly = 1,
  KycAndAgreement = 2,
}

export interface ExtensionInitParams {
  title: string | MessageDescriptor;
  fieldName?: string | MessageDescriptor;
  description?: string | MessageDescriptor;
  defaultValue: string | number;
  paramName: string;
  validation: object;
  type: ExtensionParamType;
  options?: CustomRadioProps[];
  disabled?: (props: any) => boolean;
  complementaryLabel?: 'hours' | 'periods' | 'percent';
  tokenLabel?: 'tokenToBeSold' | 'purchaseToken';
}

export interface ExtensionData {
  address?: Address;
  extensionId: Extension | 'Unknown';
  name: string | MessageDescriptor;
  header?: string | MessageDescriptor;
  descriptionShort: string | MessageDescriptor;
  descriptionLong: string | MessageDescriptor;
  descriptionExtended?: string | MessageDescriptor;
  descriptionLink1?: ReactElement;
  descriptionLink2?: ReactElement;
  tokenContractAddress?: ReactElement;
  info?: string | MessageDescriptor;
  termsCondition?: string | MessageDescriptor;
  currentVersion: number;
  createdAt: number;
  neededColonyPermissions: ColonyRole[];
  initializationParams?: ExtensionInitParams[];
  extraInitParams?: ExtensionInitParams[];
  uninstallable: boolean;
  enabledExtensionBody?: (props: ExtensionBodyProps) => ReactNode;
}

const unknownExtensionMessages = {
  unknownName: {
    id: 'extensions.Unknown.name',
    defaultMessage: 'Unknown Extension',
  },
  unknownDescription: {
    id: 'extensions.Unknown.description',
    defaultMessage: 'I do not know this extension',
  },
};

const oneTransactionPaymentMessages = {
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
};

// to add a more detailed link
const COIN_MACHINE_DESCRIPTION_LINK = 'https://colony.gitbook.io/colony/';
const COIN_MACHINE_GOOGLE_SHEET_LINK = `https://docs.google.com/spreadsheets/d/1ZCuFcwqI4S6ZK5OwTl1yN7AK8mjv5d_V3g-_kMen01Y/edit#gid=2013814210`;
const BLOCKSCOUT_LINK = 'https://blockscout.com';

const coinMachineMessages = {
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
  coinMachineDescriptionExtended: {
    id: 'extensions.CoinMachine.descriptionExtended',
    defaultMessage: `\nAfter enabling Coin Machine, to start your sale simply send the quantity of the token you wish to sell to your Coin Machine’s “Contract address” (available on the right side of this screen) and the sale will start immediately. The sale will end once either all the tokens are sold, or the extension is deprecated.\n\nTo better understand how the following parameters will affect your token sale, you may copy and experiment with this {link1} to model your own sale.\n\nTo learn more about Coin Machine, please see {link2}.`,
  },
  coinMachineDescriptionGoogleSheetLink: {
    id: 'extensions.CoinMachine.coinMachineDescriptionLink',
    defaultMessage: 'Google Sheet',
  },
  coinMachineDescriptionHereLink: {
    id: 'extensions.CoinMachine.coinMachineDescriptionLink',
    defaultMessage: 'here',
  },
  coinMachineTokenContractAddress: {
    id: 'extensions.CoinMachine.tokenContractAddress',
    defaultMessage: 'Token contract address {link}',
  },
  coinMachinePurchaseTokenTitle: {
    id: 'extensions.CoinMachine.param.purchaseToken.title',
    defaultMessage: 'Purchase Token',
  },
  coinMachinePurchaseTokenFieldName: {
    id: 'extensions.CoinMachine.param.purchaseToken.fieldName',
    defaultMessage: `Select the token you wish to receive in exchange for the token you are selling.`,
  },
  coinMachinePurchaseTokenDescription: {
    id: 'extensions.CoinMachine.param.purchaseToken.description',
    defaultMessage: `If the token is not in this list, you must add it to your colony by going to New Action / Manage Funds / Manage tokens.`,
  },
  coinMachineTokenToBeSoldTitle: {
    id: 'extensions.CoinMachine.param.tokenToBeSold.title',
    defaultMessage: 'Token To Be Sold',
  },
  coinMachineTokenToBeSoldFieldName: {
    id: 'extensions.CoinMachine.param.tokenToBeSold.fieldName',
    defaultMessage: 'Select the token you wish to sell.',
  },
  coinMachineTokenToBeSoldDescription: {
    id: 'extensions.CoinMachine.param.tokenToBeSold.description',
    defaultMessage: `If the token is not in this list, you must add it to your colony by going to New Action / Manage Funds / Manage tokens.`,
  },
  coinMachinePeriodLengthTitle: {
    id: 'extensions.CoinMachine.param.periodLength.title',
    defaultMessage: 'Period Length',
  },
  coinMachinePeriodLengthDescription: {
    id: 'extensions.CoinMachine.param.periodLength.description',
    defaultMessage: 'How long in hours each period of the sale should last.',
  },
  coinMachineWindowSizeTitle: {
    id: 'extensions.CoinMachine.param.windowSize.title',
    defaultMessage: 'Window Size',
  },
  coinMachineWindowSizeDescription: {
    id: 'extensions.CoinMachine.param.windowSize.description',
    defaultMessage: `This is the number of periods over which the moving average of your token’s price will be calculated. In the long term, 86% of the weighting will be in this window size. The higher the number, the slower the price will be to adjust.`,
  },
  coinMachineTargetPerPeriodTitle: {
    id: 'extensions.CoinMachine.param.targetPerPeriod.title',
    defaultMessage: 'Target Per Period',
  },
  coinMachineTargetPerPeriodDescription: {
    id: 'extensions.CoinMachine.param.targetPerPeriod.description',
    defaultMessage: `The number of tokens to aim to sell per period. If this target is not met, the price in the next period will be lower. If this target is exceeded, the price in the next period will be higher.`,
  },
  coinMachineMaxPerPeriodTitle: {
    id: 'extensions.CoinMachine.param.maxPerPeriod.title',
    defaultMessage: 'Maximum Per Period',
  },
  coinMachineMaxPerPeriodDescription: {
    id: 'extensions.CoinMachine.param.maxPerPeriod.description',
    defaultMessage: `The number of tokens to aim to sell per period. If this target is not met, the price in the next period will be lower. If this target is exceeded, the price in the next period will be higher.`,
  },
  coinMachineUserLimitFractionTitle: {
    id: 'extensions.CoinMachine.param.userLimitFraction.title',
    defaultMessage: 'Per user purchase limit',
  },
  coinMachineUserLimitFractionDescription: {
    id: 'extensions.CoinMachine.param.userLimitFraction.description',
    defaultMessage: `The maximum number of tokens a single account can purchase.`,
  },
  coinMachineStartingPriceTitle: {
    id: 'extensions.CoinMachine.param.startingPriceTitle.title',
    defaultMessage: 'Starting Price',
  },
  coinMachineStartingPriceDescription: {
    id: 'extensions.CoinMachine.param.startingPriceTitle.description',
    defaultMessage: `The price at which the first period’s tokens will be sold.`,
  },
  coinMachineWhitelistAddressTitle: {
    id: 'extensions.CoinMachine.param.whitelistAddress.title',
    defaultMessage: 'Whitelist Address',
  },
  coinMachineWhitelistAddressDescription: {
    id: 'extensions.CoinMachine.param.whitelistAddress.description',
    defaultMessage: `If you are using Colony’s whitelist extension to control which accounts are permitted to purchase tokens, please enter the contract address here.`,
  },
};

const votingReputationMessages = {
  votingReputationName: {
    id: 'extensions.votingReputation.name',
    defaultMessage: 'Motions & Disputes (Reputation)',
  },
  votingReputationDescriptionShort: {
    id: 'extensions.votingReputation.description',
    defaultMessage: `Reputation weighted decentralized governance with a minimum of voting.`,
  },
  votingReputationDescriptionLong: {
    id: 'extensions.votingReputation.descriptionLong',
    defaultMessage: `This extension allows colonies to be governed by “lazy consensus” which enables decentralized decision making without voting on every decision.\n\n<h4>How it works</h4>A colony member may create a “motion” to take an action within the colony. e.g. Pay Alice 100 xDai.\n\nFor this motion to be valid, the motion must receive a specified “stake” in the colony’s native token. This stake acts as a surety that the people who have staked the motion believe that the motion should pass (in this case, that Alice should be paid 100 xDai).\n\nIf the motion does not receive its full stake before the staking period ends, the motion will fail.\n\nAs long as nobody “objects” to the motion, the motion will automatically pass after a security delay, and Alice will be able to claim her 100 xDai.\n\nHowever, if someone believes that Alice should *not* be paid 100 xDai, and believes that a majority of the people in the colony will agree, they can object to the motion by staking in opposition to it, and cause a vote to take place.\n\nVotes are weighted by the voters reputation in the team in which the vote is taking place. Voters are incentivised to vote by being rewarded with a share of the stake of the losing side of the vote. The remainder of the losers stake is divided between the winning and losing stakers, proportional to the outcome of the vote.`,
  },
  votingReputationTotalStakeFractionTitle: {
    id: 'extensions.votingReputation.param.totalStakeFraction.title',
    defaultMessage: 'Required Stake',
  },
  votingReputationTotalStakeFractionDescription: {
    id: 'extensions.votingReputation.param.totalStakeFraction.description',
    defaultMessage: `What percentage of the team’s reputation, in token terms, should need to stake on each side of a motion?\n\n<span>e.g. if a team has 100 reputation points between them, and the Required Stake is 5%, then 5 tokens would need to be staked to either support or object to a motion.</span>`,
  },
  votingReputationVoterRewardFractionTitle: {
    id: 'extensions.votingReputation.param.voterRewardFraction.title',
    defaultMessage: 'Voter Reward',
  },
  votingReputationVoterRewardFractionDescription: {
    id: 'extensions.votingReputation.param.voterRewardFraction.description',
    defaultMessage: `In a dispute, what percentage of the losing side’s stake should be awarded to the voters?\n\n<span>e.g. If both the colony members who create a motion, and the colony members who raise an objection stake 50 tokens, and the Voter Reward is 20%, then the voters will share 20 tokens between them, proportional to their reputations (i.e. 20% of the combined stake of both side of the dispute). The remainder will be shared between the stakers proportional to the outcome of the vote.</span>`,
  },
  votingReputationUserMinStakeFractionTitle: {
    id: 'extensions.votingReputation.param.userMinStakeFraction.title',
    defaultMessage: 'Minimum Stake',
  },
  votingReputationUserMinStakeFractionDescription: {
    id: 'extensions.votingReputation.param.userMinStakeFraction.description',
    defaultMessage: `What is the minimum percentage of the total stake that each staker should have to provide?\n\n<span>e.g. 10% means anybody who wishes to stake must provide at least 10% of the Required Stake.</span>`,
  },
  votingReputationMaxVoteFractionTitle: {
    id: `extensions.votingReputation.param.votingReputationMaxVoteFractionTitle.title`,
    defaultMessage: 'End Vote Threshold',
  },
  votingReputationMaxVoteFractionDescription: {
    id: 'extensions.votingReputation.param.maxVoteFraction.description',
    defaultMessage: `At what threshold of reputation having voted should the voting period to end?\n\n<span>e.g. If the End Vote Threshold is 70%, then the voting period will end as soon as 70% of the reputation in a team has cast their vote. This helps votes get settled faster. If you want to ensure everyone gets to vote if they want to, set the value to 100%.</span>`,
  },
  votingReputationStakePeriodTitle: {
    id: 'extensions.votingReputation.param.stakePeriod.title',
    defaultMessage: 'Staking Phase Duration',
  },
  votingReputationStakePeriodDescription: {
    id: 'extensions.votingReputation.param.stakePeriod.description',
    defaultMessage: `How long do you want to allow each side of a motion to get staked?\n\n<span>e.g. If the staking phase is 72 hours, then once a motion is created members will have 72 hours to provide the full stake required to back the motion. If the motion does not receive the full stake in 72 hours, it will fail. Once the motion has been fully staked, the staking period will reset and members will have a further 72 hours in which to “Object” by staking against the motion if they wish to take the decision to a vote. If the full stake for the objection is not staked, then the motion will automatically pass.</span>`,
  },
  votingReputationSubmitPeriodTitle: {
    id: 'extensions.votingReputation.param.submitPeriod.title',
    defaultMessage: 'Voting Phase Duration',
  },
  votingReputationSubmitPeriodDescription: {
    id: 'extensions.votingReputation.param.submitPeriod.description',
    defaultMessage: `How long do you want to give members to cast their votes?\n\n<span>e.g. if the vote duration is 72 hours, then after both sides of the motion are fully staked, members with reputation in the team will have 72 hours in which to vote, unless the “End Vote Threshold” is reached, in which case the vote will end early.</span>`,
  },
  votingReputationRevealPeriodTitle: {
    id: 'extensions.votingReputation.param.revealPeriod.title',
    defaultMessage: 'Reveal Phase Duration',
  },
  votingReputationRevealPeriodDescription: {
    id: 'extensions.votingReputation.param.revealPeriod.description',
    defaultMessage: `How long do you want to give members to reveal their votes?\n\n<span>e.g. Votes in colony are secret while the vote is ongoing, and so must be revealed once votes have been cast. If the reveal phase is 72 hours long, then members will have 72 hours to reveal their votes, otherwise their votes will not be counted and they will not receive a share of the voter reward. If all votes are revealed before the end of the reveal phase, then the reveal phase will end.</span>`,
  },
  votingReputationEscalationPeriodTitle: {
    id: 'extensions.votingReputation.param.escalationPeriod.title',
    defaultMessage: 'Escalation Phase Duration',
  },
  votingReputationEscalationPeriodDescription: {
    id: 'extensions.votingReputation.param.escalationPeriod.description',
    defaultMessage: `How long do you wish to allow for members to escalate a dispute to a higher team?\n\n<span>e.g. If the escalation phase is 72 hours, once the outcome of a vote is known, if the loser feels the outcome was for any reason incorrect, then they will have 72 hours in which to escalate the dispute to a higher team in the colony by increasing the stake to meet the required stake of that higher team.</span>`,
  },
  votingReputationRequiredError: {
    id: 'extensions.votingReputation.param.validation.requiredError',
    defaultMessage: 'Please enter a value.',
  },
  votingReputationLessThan50Error: {
    id: 'extensions.votingReputation.param.validation.lessThan50Error',
    defaultMessage: 'Please enter a percentage less than or equal to 50%.',
  },
  votingReputationLessThan100Error: {
    id: 'extensions.votingReputation.param.validation.lessThan100Error',
    defaultMessage: 'Please enter a percentage less than or equal to 100%.',
  },
  votingReputationLessThan1YearError: {
    id: 'extensions.votingReputation.param.validation.lessThan50Error',
    defaultMessage: 'Please enter hours less than or equal to 1 year.',
  },
};

const whitelistMessages = {
  whitelistName: {
    id: 'extensions.whitelist.name',
    defaultMessage: 'Whitelist',
  },
  whitelistHeader: {
    id: 'extensions.whitelist.header',
    defaultMessage: 'What is the Whitelist extension?',
  },
  whitelistDescriptionShort: {
    id: 'extensions.whitelist.description',
    defaultMessage: `Curate a list of addresses permitted to participate in your Coin Machine sale.`,
  },
  whitelistDescriptionLong: {
    id: 'extensions.whitelist.descriptionLong',
    defaultMessage: `The Whitelist extension is an utility which can be used for whitelisting wallet addresses.`,
  },
  whitelistTermsCondition: {
    id: 'extensions.whitelist.termsCondition',
    defaultMessage: `Terms and Conditions.`,
  },
  whitelistInfo: {
    id: 'extensions.whitelist.info',
    defaultMessage: `The responsibility is on the issuer to ensure being compliant with the local rules. {link}`,
  },
  agreementTitle: {
    id: 'extensions.whitelist.param.agreement.title',
    defaultMessage: 'Paste agreement',
  },
  agreementDescription: {
    id: 'extensions.whitelist.param.agreement.description',
    defaultMessage:
      'This agreement will be displayed during whitelisting process modal ',
  },
  whitelistColonyPolicySelectorTitle: {
    id: `extensions.whitelist.param.policy.title`,
    defaultMessage: 'What is the colony policy on whitelisting?',
  },
  whitelistColonyPolicySelectorAgreementOnly: {
    id: `extensions.whitelist.param.policy.option.agreementOnly`,
    defaultMessage: 'Agreement only',
  },
  whitelistColonyPolicySelectorKYCOnly: {
    id: 'extensions.whitelist.param.policy.option.KYCOnly',
    defaultMessage: 'KYC only',
  },
  whitelistColonyPolicySelectorAgreementAndKYC: {
    id: `extensions.whitelist.param.policy.option.agreementAndKYC`,
    defaultMessage: 'KYC and agreement',
  },
};

const MSG = defineMessages({
  ...unknownExtensionMessages,
  ...oneTransactionPaymentMessages,
  ...coinMachineMessages,
  ...votingReputationMessages,
  ...whitelistMessages,
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
    descriptionExtended: MSG.coinMachineDescriptionExtended,
    descriptionLink1: (
      <ExternalLink
        text={MSG.coinMachineDescriptionGoogleSheetLink}
        href={COIN_MACHINE_GOOGLE_SHEET_LINK}
      />
    ),
    descriptionLink2: (
      <ExternalLink
        text={MSG.coinMachineDescriptionHereLink}
        href={COIN_MACHINE_DESCRIPTION_LINK}
      />
    ),
    currentVersion: 1,
    createdAt: 1603915271852,
    neededColonyPermissions: [ColonyRole.Root],
    tokenContractAddress: (
      <FormattedMessage
        {...MSG.coinMachineTokenContractAddress}
        values={{
          link: <ExternalLink href={BLOCKSCOUT_LINK} text="Blockscout" />,
        }}
      />
    ),
    extraInitParams: [
      {
        paramName: 'whitelistAddress',
        validation: yup.string().required(),
        defaultValue: AddressZero,
        title: MSG.coinMachineWhitelistAddressTitle,
        description: MSG.coinMachineWhitelistAddressDescription,
        type: ExtensionParamType.Input,
      },
      {
        paramName: 'tokenToBeSold',
        validation: yup.string().required(),
        defaultValue: AddressZero,
        title: MSG.coinMachineTokenToBeSoldTitle,
        fieldName: MSG.coinMachineTokenToBeSoldFieldName,
        description: MSG.coinMachineTokenToBeSoldDescription,
        type: ExtensionParamType.TokenSymbolSelector,
      },
      {
        paramName: 'purchaseToken',
        validation: yup.string().required(),
        defaultValue: AddressZero,
        title: MSG.coinMachinePurchaseTokenTitle,
        fieldName: MSG.coinMachinePurchaseTokenFieldName,
        description: MSG.coinMachinePurchaseTokenDescription,
        type: ExtensionParamType.TokenSymbolSelector,
      },
    ],
    initializationParams: [
      {
        paramName: 'periodLength',
        validation: yup.number().required(),
        title: MSG.coinMachinePeriodLengthTitle,
        description: MSG.coinMachinePeriodLengthDescription,
        defaultValue: 1,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
      },
      {
        paramName: 'windowSize',
        validation: yup.number().required(),
        title: MSG.coinMachineWindowSizeTitle,
        description: MSG.coinMachineWindowSizeDescription,
        defaultValue: 24,
        type: ExtensionParamType.Input,
        complementaryLabel: 'periods',
      },
      {
        paramName: 'targetPerPeriod',
        validation: yup.number().required(),
        title: MSG.coinMachineTargetPerPeriodTitle,
        description: MSG.coinMachineTargetPerPeriodDescription,
        defaultValue: 200000,
        type: ExtensionParamType.Input,
        tokenLabel: 'tokenToBeSold',
      },
      {
        paramName: 'maxPerPeriod',
        validation: yup.number().required(),
        title: MSG.coinMachineMaxPerPeriodTitle,
        description: MSG.coinMachineMaxPerPeriodDescription,
        defaultValue: 400000,
        type: ExtensionParamType.Input,
        tokenLabel: 'tokenToBeSold',
      },
      {
        paramName: 'userLimitFraction',
        validation: yup.string().required(),
        title: MSG.coinMachineUserLimitFractionTitle,
        description: MSG.coinMachineUserLimitFractionDescription,
        defaultValue: 200000,
        type: ExtensionParamType.Input,
        tokenLabel: 'tokenToBeSold',
      },
      {
        paramName: 'startingPrice',
        validation: yup.number().required(),
        title: MSG.coinMachineStartingPriceTitle,
        description: MSG.coinMachineStartingPriceDescription,
        defaultValue: 0.1,
        type: ExtensionParamType.Input,
        tokenLabel: 'purchaseToken',
      },
    ],
    uninstallable: true,
  },
  VotingReputation: {
    extensionId: Extension.VotingReputation,
    name: MSG.votingReputationName,
    descriptionShort: MSG.votingReputationDescriptionShort,
    descriptionLong: MSG.votingReputationDescriptionLong,
    currentVersion: 1,
    createdAt: 1603915271852,
    neededColonyPermissions: [
      ColonyRole.Root,
      ColonyRole.Administration,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
      ColonyRole.Funding,
    ],
    initializationParams: [
      {
        paramName: 'totalStakeFraction',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(50, () => MSG.votingReputationLessThan50Error),
        defaultValue: 1,
        title: MSG.votingReputationTotalStakeFractionTitle,
        description: MSG.votingReputationTotalStakeFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
      },
      {
        paramName: 'voterRewardFraction',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(50, () => MSG.votingReputationLessThan50Error),
        defaultValue: 20,
        title: MSG.votingReputationVoterRewardFractionTitle,
        description: MSG.votingReputationVoterRewardFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
      },
      {
        paramName: 'userMinStakeFraction',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(100, () => MSG.votingReputationLessThan100Error),
        defaultValue: 1,
        title: MSG.votingReputationUserMinStakeFractionTitle,
        description: MSG.votingReputationUserMinStakeFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
      },
      {
        paramName: 'maxVoteFraction',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(100, () => MSG.votingReputationLessThan100Error),
        defaultValue: 70,
        title: MSG.votingReputationMaxVoteFractionTitle,
        description: MSG.votingReputationMaxVoteFractionDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'percent',
      },
      {
        paramName: 'stakePeriod',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(8760, () => MSG.votingReputationLessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationStakePeriodTitle,
        description: MSG.votingReputationStakePeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
      },
      {
        paramName: 'submitPeriod',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(8760, () => MSG.votingReputationLessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationSubmitPeriodTitle,
        description: MSG.votingReputationSubmitPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
      },
      {
        paramName: 'revealPeriod',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(8760, () => MSG.votingReputationLessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationRevealPeriodTitle,
        description: MSG.votingReputationRevealPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
      },
      {
        paramName: 'escalationPeriod',
        validation: yup
          .number()
          .positive()
          .required(() => MSG.votingReputationRequiredError)
          .max(8760, () => MSG.votingReputationLessThan1YearError),
        defaultValue: 72, // 3 days in hours
        title: MSG.votingReputationEscalationPeriodTitle,
        description: MSG.votingReputationEscalationPeriodDescription,
        type: ExtensionParamType.Input,
        complementaryLabel: 'hours',
      },
    ],
    uninstallable: true,
  },
  Whitelist: {
    extensionId: Extension.Whitelist,
    name: MSG.whitelistName,
    header: MSG.whitelistHeader,
    descriptionShort: MSG.whitelistDescriptionShort,
    descriptionLong: MSG.whitelistDescriptionLong,
    info: MSG.whitelistInfo,
    termsCondition: MSG.whitelistTermsCondition,
    currentVersion: 1,
    createdAt: 1603915271852,
    neededColonyPermissions: [
      ColonyRole.Root,
      ColonyRole.Administration,
      ColonyRole.Arbitration,
      ColonyRole.Architecture,
      ColonyRole.Funding,
    ],
    enabledExtensionBody: (props) => Whitelist(props),
    initializationParams: [
      {
        paramName: 'policy',
        validation: yup.number().required(),
        defaultValue: '',
        title: MSG.whitelistColonyPolicySelectorTitle,
        type: ExtensionParamType.ColonyPolicySelector,
        options: [
          {
            value: PolicyType.AgreementOnly,
            label: MSG.whitelistColonyPolicySelectorAgreementOnly,
            name: 'policy',
            appearance: {
              theme: 'greyWithCircle',
            },
            checked: false,
          },
          {
            value: PolicyType.KycOnly,
            label: MSG.whitelistColonyPolicySelectorKYCOnly,
            name: 'policy',
            appearance: {
              theme: 'greyWithCircle',
            },
            checked: false,
          },
          {
            value: PolicyType.KycAndAgreement,
            label: MSG.whitelistColonyPolicySelectorAgreementAndKYC,
            name: 'policy',
            appearance: {
              theme: 'greyWithCircle',
            },
            checked: false,
          },
        ],
      },
      {
        paramName: 'agreement',
        validation: yup.string().when('policy', {
          is: (policy) =>
            policy === PolicyType.AgreementOnly ||
            policy === PolicyType.KycAndAgreement,
          then: yup.string().required().min(100),
          otherwise: false,
        }),
        defaultValue: '',
        title: MSG.agreementTitle,
        description: MSG.agreementDescription,
        type: ExtensionParamType.Textarea,
        disabled: (values) =>
          !values.policy || values.policy === PolicyType.KycOnly,
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

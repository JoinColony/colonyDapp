import React, { ReactNode, ReactElement } from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { ColonyRole, Extension } from '@colony/colony-js';
import * as yup from 'yup';
import toFinite from 'lodash/toFinite';

import Whitelist from '~dashboard/Whitelist';
import { CustomRadioProps } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import { Colony } from '~data/index';
import { Address, WhitelistPolicy } from '~types/index';

export interface ExtensionBodyProps {
  colony: Colony;
}

export enum ExtensionParamType {
  Input = 'Input',
  Radio = 'Radio',
  Textarea = 'Textarea',
  ColonyPolicySelector = 'ColonyPolicySelector',
  TokenSelector = 'TokenSelector',
}

export interface ExtensionInitParams {
  title: string | MessageDescriptor;
  fieldName?: string | MessageDescriptor;
  description?: string | MessageDescriptor;
  defaultValue?: string | number;
  paramName: string;
  validation: object;
  type: ExtensionParamType;
  options?: CustomRadioProps[];
  disabled?: (props: any) => boolean;
  complementaryLabel?: 'hours' | 'periods' | 'percent';
  tokenLabel?: 'tokenToBeSold' | 'purchaseToken';
  orderNumber?: number;
}

export interface ExtensionData {
  address?: Address;
  extensionId: Extension | 'Unknown';
  name: string | MessageDescriptor;
  header?: string | MessageDescriptor;
  descriptionShort: string | MessageDescriptor;
  descriptionLong: string | MessageDescriptor;
  descriptionExtended?: string | MessageDescriptor;
  descriptionLinks?: ReactElement[];
  tokenContractAddress?: (address: string) => ReactElement;
  info?: string | MessageDescriptor;
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

const votingReputationMessages = {
  votingReputationName: {
    id: 'extensions.votingReputation.name',
    defaultMessage: 'Governance (Reputation Weighted)',
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

const WHITELIST_TERMS_AND_CONDITIONS_LINK = 'https://colony.io/pdf/terms.pdf';

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
    defaultMessage: `The responsibility is on the issuer to ensure being compliant with the local rules. {link0}`,
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
          .transform((value) => toFinite(value))
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
    descriptionLinks: [
      <ExternalLink
        text={MSG.whitelistTermsCondition}
        href={WHITELIST_TERMS_AND_CONDITIONS_LINK}
      />,
    ],
    currentVersion: 1,
    createdAt: 1603915271852,
    neededColonyPermissions: [],
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
            value: WhitelistPolicy.AgreementOnly,
            label: MSG.whitelistColonyPolicySelectorAgreementOnly,
            name: 'policy',
            appearance: {
              theme: 'greyWithCircle',
            },
            checked: false,
          },
          {
            value: WhitelistPolicy.KycOnly,
            label: MSG.whitelistColonyPolicySelectorKYCOnly,
            name: 'policy',
            appearance: {
              theme: 'greyWithCircle',
            },
            checked: false,
          },
          {
            value: WhitelistPolicy.KycAndAgreement,
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
            policy === WhitelistPolicy.AgreementOnly ||
            policy === WhitelistPolicy.KycAndAgreement,
          then: yup.string().required().min(100),
          otherwise: false,
        }),
        defaultValue: undefined,
        title: MSG.agreementTitle,
        description: MSG.agreementDescription,
        type: ExtensionParamType.Textarea,
        disabled: (values) =>
          !values.policy || values.policy === WhitelistPolicy.KycOnly,
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

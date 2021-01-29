import sortBy from 'lodash/sortBy';
import isEqual from 'lodash/isEqual';

import {
  ColonyActions,
  ColonyAndExtensionsEvents,
  FormattedAction,
} from '~types/index';
import { ColonyAction } from '~data/index';

import {
  DETAILS_FOR_ACTION,
  ActionPageDetails,
} from '~dashboard/ActionsPage/staticMaps';

type DetailsValuesMap = Partial<
  {
    [key in ActionPageDetails]: boolean;
  }
>;

type ValuesForActionTypesMap = Partial<
  {
    [key in keyof FormattedAction]: FormattedAction[key];
  }
>;

/*
 * Get colony action details for DetailsWidget based on action type and ActionPageDetails map
 */
export const getDetailsForAction = (
  actionType: ColonyActions,
): DetailsValuesMap => {
  const detailsForActionType = DETAILS_FOR_ACTION[actionType];
  return Object.keys(ActionPageDetails).reduce((detailsMap, detailsKey) => {
    return {
      ...detailsMap,
      [detailsKey]: detailsForActionType?.includes(
        detailsKey as ActionPageDetails,
      ),
    };
  }, {});
};

/*
 * Get values for action type based on action type
 */
export const getValuesForActionType = (
  args: string,
  actionType: ColonyActions,
): ValuesForActionTypesMap => {
  const argsObj = JSON.parse(args);
  switch (actionType) {
    case ColonyActions.MintTokens: {
      return {
        initiator: argsObj.agent,
        recipient: argsObj.who,
        amount: argsObj.amount,
      };
    }
    case ColonyActions.CreateDomain: {
      return {
        initiator: argsObj.agent,
        fromDomain: argsObj.domainId,
      };
    }
    case ColonyActions.ColonyEdit: {
      return {
        initiator: argsObj.agent,
      };
    }
    case ColonyActions.MoveFunds: {
      return {
        amount: argsObj.amount,
        fromDomain: argsObj.fromPot,
        toDomain: argsObj.toPot,
        initiator: argsObj.agent,
      };
    }
    case ColonyActions.EditDomain: {
      return {
        initiator: argsObj.agent,
        fromDomain: argsObj.domainId,
      };
    }
    default: {
      return {};
    }
  }
};

export const getColonyMetadataMessageDescriptorsIds = (
  actionType: ColonyAndExtensionsEvents,
  { nameChanged, logoChanged, tokensChanged }: { [key: string]: boolean },
) => {
  if (actionType === ColonyAndExtensionsEvents.ColonyMetadata) {
    if (nameChanged && logoChanged) {
      return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.nameLogo`;
    }
    if (nameChanged) {
      return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.name`;
    }
    if (logoChanged) {
      return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.logo`;
    }
    if (tokensChanged) {
      return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.tokens`;
    }
  }
  return `event.${ColonyAndExtensionsEvents.ColonyMetadata}.fallback`;
};

export const getDomainMetadataMessageDescriptorsIds = (
  actionType: ColonyAndExtensionsEvents,
  { nameChanged, colorChanged, descriptionChanged }: { [key: string]: boolean },
) => {
  if (actionType === ColonyAndExtensionsEvents.DomainMetadata) {
    if (nameChanged && colorChanged && descriptionChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.all`;
    }
    if (nameChanged && colorChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.nameColor`;
    }
    if (nameChanged && descriptionChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.nameDescription`;
    }
    if (colorChanged && descriptionChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.descriptionColor`;
    }
    if (nameChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.name`;
    }
    if (colorChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.color`;
    }
    if (descriptionChanged) {
      return `event.${ColonyAndExtensionsEvents.DomainMetadata}.description`;
    }
  }
  return `event.${ColonyAndExtensionsEvents.DomainMetadata}.fallback`;
};

export const parseColonyMetadata = (
  jsonMetadata: string,
): {
  colonyDisplayName: string | null;
  colonyAvatarHash: string | null;
  colonyTokens: string[] | null;
} => {
  try {
    if (jsonMetadata) {
      const {
        colonyDisplayName = null,
        colonyAvatarHash = null,
        colonyTokens = [],
      } = JSON.parse(jsonMetadata);
      return {
        colonyDisplayName,
        colonyAvatarHash,
        colonyTokens,
      };
    }
  } catch (error) {
    console.error('Could not parse colony ipfs json blob', jsonMetadata);
    console.error(error);
  }
  return {
    colonyDisplayName: null,
    colonyAvatarHash: null,
    colonyTokens: [],
  };
};

export const parseDomainMetadata = (
  jsonMetadata: string,
): {
  domainName: string | null;
  domainPurpose: string | null;
  domainColor: string | null;
} => {
  try {
    if (jsonMetadata) {
      const {
        domainName = null,
        domainPurpose = null,
        domainColor = null,
      } = JSON.parse(jsonMetadata);
      return {
        domainName,
        domainPurpose,
        domainColor,
      };
    }
  } catch (error) {
    console.error('Could not parse domain ipfs json blob', jsonMetadata);
    console.error(error);
  }
  return {
    domainName: null,
    domainPurpose: null,
    domainColor: null,
  };
};

export const sortMetdataHistory = (colonyMetadata) =>
  sortBy(colonyMetadata, [
    ({
      transaction: {
        block: { timestamp },
      },
    }) => new Date(parseInt(`${timestamp}000`, 10)).getTime(),
  ]);

/*
 * Generates various checks based on action data and type
 *
 * This is to be used to generate super-specific message desciptors based on
 * logic checks.
 *
 * Currently only used for the colony metadata changed action
 */
export const getSpecificActionValuesCheck = (
  actionType: ColonyAndExtensionsEvents,
  {
    colonyDisplayName: currentColonyDisplayName,
    colonyAvatarHash: currentColonyAvatarHash,
    colonyTokens: currentColonyTokens,
    domainName: currentDomainName,
    domainPurpose: currentDomainPurpose,
    domainColor: currentDomainColor,
  }: ColonyAction,
  {
    colonyDisplayName: prevColonyDisplayName,
    colonyAvatarHash: prevColonyAvatarHash,
    colonyTokens: prevColonyTokens,
    domainName: prevDomainName,
    domainPurpose: prevDomainPurpose,
    domainColor: prevDomainColor,
  }: {
    colonyDisplayName?: string | null;
    colonyAvatarHash?: string | null;
    colonyTokens?: string[] | null;
    domainName?: string | null;
    domainPurpose?: string | null;
    domainColor?: string | null;
  },
): { [key: string]: boolean } => {
  switch (actionType) {
    case ColonyAndExtensionsEvents.ColonyMetadata: {
      const nameChanged = prevColonyDisplayName !== currentColonyDisplayName;
      const logoChanged = prevColonyAvatarHash !== currentColonyAvatarHash;
      /*
       * Tokens arrays might come from a subgraph query, in which case
       * they're not really "arrays", so we have to create a new instace of
       * them in order to sort and compare
       */
      const tokensChanged = !isEqual(
        prevColonyTokens ? prevColonyTokens.slice(0).sort() : [],
        currentColonyTokens.slice(0).sort(),
      );
      return {
        nameChanged,
        logoChanged,
        tokensChanged,
      };
    }
    case ColonyAndExtensionsEvents.DomainMetadata: {
      const nameChanged = prevDomainName !== currentDomainName;
      const colorChanged =
        Number(prevDomainColor) !== Number(currentDomainColor);
      const descriptionChanged = prevDomainPurpose !== currentDomainPurpose;
      return {
        nameChanged,
        colorChanged,
        descriptionChanged,
      };
    }
    default: {
      return {
        hasValues: false,
      };
    }
  }
};

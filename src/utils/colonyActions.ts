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
    default: {
      return {};
    }
  }
};

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
  actionData: ColonyAction,
): { [key: string]: boolean } => {
  switch (actionType) {
    case ColonyAndExtensionsEvents.ColonyMetadata: {
      return {
        logoChanged: true,
      };
    }
    default: {
      return {
        hasValues: false,
      };
    }
  }
};

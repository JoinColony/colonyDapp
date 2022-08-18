// When called without an argument (from `Routes.tsx`) this hook
// parses the window location URL to set the title. If called
// with an argument `title` (from any component), it sets the
// document title to `title` - this might be especially useful
// when you want to manipulate the title even when the route
// remains same (for example, when multiple dialogue boxes can
// be present on the same route.)

import { useLocation, matchPath } from 'react-router-dom';
import { useEffect } from 'react';
import { defineMessages, useIntl, MessageDescriptor } from 'react-intl';
import {
  CREATE_COLONY_ROUTE,
  CONNECT_ROUTE,
  CREATE_USER_ROUTE,
  INBOX_ROUTE,
  USER_EDIT_ROUTE,
  WALLET_ROUTE,
  NOT_FOUND_ROUTE,
  LANDING_PAGE_ROUTE,
  COLONY_HOME_ROUTE,
  COLONY_EVENTS_ROUTE,
  ACTIONS_PAGE_ROUTE,
  USER_ROUTE,
  MEMBERS_ROUTE,
  COLONY_DECISIONS_ROUTE,
  COLONY_DECISIONS_PREVIEW_ROUTE,
  COLONY_EXTENSION_SETUP_ROUTE,
  COLONY_EXTENSION_DETAILS_ROUTE,
  COLONY_EXTENSIONS_ROUTE,
  COLONY_FUNDING_ROUTE,
} from '~routes/routeConstants';
import { SimpleMessageValues } from '~types/index';
import { useColonyFromNameQuery } from '~data/index';

const MSG = defineMessages({
  connect: {
    id: 'utils.hooks.useTitle.connect',
    defaultMessage: `Connect Wallet | Colony`,
  },
  createColony: {
    id: 'utils.hooks.useTitle.creatColony',
    defaultMessage: `Create Colony | Colony`,
  },

  createUser: {
    id: 'utils.hooks.useTitle.creatUser',
    defaultMessage: `Create User | Colony`,
  },

  inbox: {
    id: 'utils.hooks.useTitle.inbox',
    defaultMessage: `Inbox | Colony`,
  },

  editProfile: {
    id: 'utils.hooks.useTitle.editProfile',
    defaultMessage: `Edit Profile | Colony`,
  },

  wallet: {
    id: 'utils.hooks.useTitle.wallet',
    defaultMessage: `Wallet | Colony`,
  },

  notFound: {
    id: 'utils.hooks.useTitle.notFound',
    defaultMessage: `404 - Not Found | Colony`,
  },

  landing: {
    id: 'utils.hooks.useTitle.landing',
    defaultMessage: `Welcome to Colony`,
  },

  colonyHome: {
    id: 'utils.hooks.useTitle.colonyHome',
    defaultMessage: `Actions | Colony - {colonyName}`,
  },

  colonyEvents: {
    id: 'utils.hooks.useTitle.colonyEvents',
    defaultMessage: `Transactions Log | Colony - {colonyName}`,
  },

  colonyFunds: {
    id: 'utils.hooks.useTitle.colonyFunds',
    defaultMessage: `Funds | Colony - {colonyName}`,
  },

  colonyDecisions: {
    id: 'utils.hooks.useTitle.colonyDecisions',
    defaultMessage: `Decisions | Colony - {colonyName}`,
  },

  decisionPreview: {
    id: 'utils.hooks.useTitle.decisionPreview',
    defaultMessage: `Decision Preview | Colony - {colonyName}`,
  },

  colonyExtensions: {
    id: 'utils.hooks.useTitle.colonyExtensions',
    defaultMessage: `Extensions | Colony - {colonyName}`,
  },

  colonyExtensionDetails: {
    id: 'utils.hooks.useTitle.colonyExtensionDetails',
    defaultMessage: `Extensions > {extensionId, select,
      VotingReputation {Governance}
      OneTxPayment {One Transaction Payment}
      other {{extensionId}}
      } | Colony - {colonyName}`,
  },

  colonyExtensionSetup: {
    id: 'utils.hooks.useTitle.colonyExtensionSetup',
    defaultMessage: `Extensions > {extensionId, select,
      VotingReputation {Governance}
      OneTxPayment {One Transaction Payment}
      other {{extensionId}}
      } > Setup | Colony - {colonyName}`,
  },

  colonyMembers: {
    id: 'utils.hooks.useTitle.colonyMembers',
    defaultMessage: `Members | Colony - {colonyName}`,
  },

  userProfile: {
    id: 'utils.hooks.useTitle.userProfile',
    defaultMessage: `Users > {username} | Colony`,
  },

  transactionDetails: {
    id: 'utils.hooks.useTitle.transactionDetails',
    defaultMessage: `Transaction - {transactionHash} | Colony - {colonyName}`,
  },
  buyTokens: {
    id: 'utils.hooks.useTitle.buyTokens',
    defaultMessage: `Buy Tokens | Colony - {colonyName}`,
  },
  fallbackTitle: {
    id: 'utils.hooks.useTitle.fallbackTitle',
    defaultMessage: `Colony`,
  },
});

interface MessageWithValues {
  msg: MessageDescriptor;
  values?: SimpleMessageValues;
}

const routeMessages: Record<string, MessageDescriptor> = {
  [CONNECT_ROUTE]: MSG.connect,
  [CREATE_COLONY_ROUTE]: MSG.createColony,
  [CREATE_USER_ROUTE]: MSG.createUser,
  [INBOX_ROUTE]: MSG.inbox,
  [USER_EDIT_ROUTE]: MSG.editProfile,
  [WALLET_ROUTE]: MSG.wallet,
  [NOT_FOUND_ROUTE]: MSG.notFound,
  [LANDING_PAGE_ROUTE]: MSG.landing,
  [COLONY_HOME_ROUTE]: MSG.colonyHome,
  [COLONY_EVENTS_ROUTE]: MSG.colonyEvents,
  [COLONY_FUNDING_ROUTE]: MSG.colonyFunds,
  [COLONY_DECISIONS_ROUTE]: MSG.colonyDecisions,
  [COLONY_DECISIONS_PREVIEW_ROUTE]: MSG.decisionPreview,
  [COLONY_EXTENSIONS_ROUTE]: MSG.colonyExtensions,
  [COLONY_EXTENSION_DETAILS_ROUTE]: MSG.colonyExtensionDetails,
  [COLONY_EXTENSION_SETUP_ROUTE]: MSG.colonyExtensionSetup,
  [MEMBERS_ROUTE]: MSG.colonyMembers,
  [USER_ROUTE]: MSG.userProfile,
  [ACTIONS_PAGE_ROUTE]: MSG.transactionDetails,
  '/': MSG.fallbackTitle,
};

const allRoutes = Object.keys(routeMessages);

const getMessageAndValues = (locationPath: string): MessageWithValues => {
  const filteredRoutes = allRoutes.filter((routePattern) =>
    matchPath(locationPath, { path: routePattern, exact: true }),
  );

  // Fallback when no route matches
  // For example before an invalid route get redirected to 404
  const matchedRoute = filteredRoutes.length > 0 ? filteredRoutes[0] : '/';

  const values = matchPath(locationPath, { path: matchedRoute, exact: true })
    ?.params; // this can be empty {}

  return { msg: routeMessages[matchedRoute], values };
};

export const useTitle = (title?: string) => {
  const location = useLocation().pathname;
  const { formatMessage } = useIntl();
  const { msg, values } = getMessageAndValues(location);

  const colonyENSName = (values?.colonyName as string) ?? ''; // HACK as we cannot call the below hook conditionally

  const { data, error } = useColonyFromNameQuery({
    // We have to define an empty address here for type safety, will be replaced by the query
    fetchPolicy: 'cache-first',
    variables: { name: colonyENSName, address: '' },
  });

  if (error) console.error(error);
  const colonyDisplayName = data?.processedColony?.displayName
    ? data.processedColony.displayName
    : colonyENSName;

  return useEffect(() => {
    const titleToSet =
      title ||
      formatMessage(msg, {
        ...values,
        colonyName: colonyDisplayName,
      });

    document.title = titleToSet;
  });
};

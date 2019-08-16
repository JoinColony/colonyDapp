/* eslint-env jest */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { IntlProvider, intlShape } from 'react-intl';

import messages from '../i18n/en.json';
// import { NOTIFICATIONS_ADD } from './modules/core/components/Notifications/notificationsActionTypes';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider(
  { locale: 'en', messages, children: [] },
  {},
);
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node: any) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node: any, { context }: any = {}) {
  return shallow(nodeWithIntlProp(node), {
    context: { ...context, intl },
  });
}

export function mountWithIntlContext(
  node: any,
  { context, childContextTypes }: any = {},
) {
  return mount(node, {
    context: { ...context, intl },
    childContextTypes: {
      intl: intlShape,
      ...childContextTypes,
    },
  });
}

export function mountWithIntl(
  node: any,
  { context, childContextTypes }: any = {},
) {
  return mount(nodeWithIntlProp(node), {
    context: { ...context, intl },
    childContextTypes: {
      intl: intlShape,
      ...childContextTypes,
    },
  });
}

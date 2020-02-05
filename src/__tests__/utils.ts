/* eslint-env jest */

import { ReactElement } from 'react';
import { mount, shallow } from 'enzyme';
import { IntlProvider } from 'react-intl';

import messages from '../i18n/en.json';

const defaultLocale = 'en';
const locale = defaultLocale;

const providerContext = {
  wrappingComponent: IntlProvider,
  wrappingComponentProps: {
    locale,
    defaultLocale,
    messages,
  },
};

export function mountWithIntl(node: ReactElement) {
  return mount(node, providerContext);
}

export function shallowWithIntl(node: ReactElement) {
  return shallow(node, providerContext);
}

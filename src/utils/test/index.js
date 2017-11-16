/* eslint-env jest */

// import React from 'react';
// import { mount, shallow } from 'enzyme';

// import { IntlProvider, intlShape } from 'react-intl';

// import messages from './i18n/en.json';
// import { NOTIFICATIONS_ADD } from './modules/core/components/Notifications/notificationsActionTypes';

// Create the IntlProvider to retrieve context for wrapping around.
// const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
// const { intl } = intlProvider.getChildContext();

export const expectRejectedPromise = promise => new Promise((resolve, reject) => {
  promise.then(() => reject(new Error('Expected promise to be rejected!')), resolve);
});

export const expectResolvedPromise = promise => new Promise((resolve, reject) => {
  promise.then(() => resolve('Expected promise to be resolve!'), reject);
});

export const formProps = {
  handleSubmit(fn) {
    if (typeof fn == 'function') {
      return function onSubmit(evt) {
        fn.call(null, evt);
      };
    }
    throw new Error('A function has to be passed to handleSubmit');
  },
  submitHandler() {
    return true;
  },
  error: '',
  submitting: false,
  pristine: true,
  invalid: false,
};

export const fieldPropsFactory = (defaultInputProps, defaultProps) => {
  const fieldPropsTemplate = {
    meta: {},
    submitting: false,
  };

  const inputPropsTemplate = {
    value: '',
  };

  return (inputProps, props) => ({
    ...fieldPropsTemplate,
    ...defaultProps,
    ...props,
    input: {
      ...inputPropsTemplate,
      ...defaultInputProps,
      ...inputProps,
    },
  });
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
// function nodeWithIntlProp(node) {
//   return React.cloneElement(node, { intl });
// }

// export function shallowWithIntl(node, { context } = {}) {
//   return shallow(
//     nodeWithIntlProp(node),
//     {
//       context: Object.assign({}, context, { intl }),
//     },
//   );
// }

// export function mountWithIntlContext(node, { context, childContextTypes } = {}) {
//   return mount(
//     node,
//     {
//       context: Object.assign({}, context, { intl }),
//       childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes),
//     },
//   );
// }

// export function mountWithIntl(node, { context, childContextTypes } = {}) {
//   return mount(
//     nodeWithIntlProp(node),
//     {
//       context: Object.assign({}, context, { intl }),
//       childContextTypes: Object.assign({}, { intl: intlShape }, childContextTypes),
//     },
//   );
// }

/*
  For snapshot testing we need a consistent timestamp
*/
export const getUTCDate = (...args) => new Date(Date.UTC(...args));

// export const calledWithErrorNotification = dispatchSpy =>
//   dispatchSpy.mock.calls[0][0].type === NOTIFICATIONS_ADD && dispatchSpy.mock.calls[0][0].payload.type === 'error';

// export const calledWithSuccessNotification = dispatchSpy =>
//   dispatchSpy.mock.calls[0][0].type === NOTIFICATIONS_ADD && dispatchSpy.mock.calls[0][0].payload.type === 'success';

/*
  Let's export some mocks because we're lazy
*/

// export { getReactRouterInstance } from './__mocks__/reactRouterMock';

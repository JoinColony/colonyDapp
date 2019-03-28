/* @flow */
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';
import type { IBrowserHistory } from 'history';

import React from 'react';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './HistoryNavigation.css';

const displayName = 'pages.NavigationWrapper.HistoryNavigation';

const MSG = defineMessages({
  backHistoryLink: {
    id: `pages.NavigationWrapper.HistoryNavigation.backHistoryLink`,
    defaultMessage: 'Go back',
  },
});

type Props = {|
  /*
   * If set, the the back link will redirect back to a specific route
   */
  backRoute?: string,
  /*
   * If set, it will change the default back link text
   */
  backText?: string | MessageDescriptor,
  /*
   * Works in conjuction with the above to provide message descriptor selector values
   */
  backTextValues?: MessageValues,
  /*
   * Browser history object injected so that we can access the previous route
   */
  history: IBrowserHistory,
  /*
   * Internationalization library object, injected by `react-intl`
   */
  intl: IntlShape,
  /*
   * In some occasions we do not want any button text
   */
  noText: boolean,
  /*
   * If you would like to stay at the same route but handle the navigation manually
   * a custom handler can be used i.e. switching to another wizard step
   */
  customHandler?: () => void,
|};

const HistoryNavigation = ({
  history,
  backRoute,
  backText,
  backTextValues,
  intl: { formatMessage },
  noText,
  customHandler,
}: Props) => {
  let linkText: string = formatMessage(MSG.backHistoryLink);
  if (backText) {
    linkText =
      typeof backText === 'string'
        ? backText
        : formatMessage(backText, backTextValues);
  }
  if (noText) {
    linkText = '';
  }
  return (
    <div className={styles.main}>
      {backRoute ? (
        <NavLink to={backRoute} className={styles.back}>
          <Icon
            name="circle-back"
            title={linkText}
            appearance={{ size: 'medium' }}
          />
          {linkText}
        </NavLink>
      ) : (
        <button
          className={styles.back}
          type="button"
          onClick={customHandler || history.goBack}
        >
          <Icon
            name="circle-back"
            title={linkText}
            appearance={{ size: 'medium' }}
          />
          {linkText}
        </button>
      )}
    </div>
  );
};

HistoryNavigation.displayName = displayName;

const enhance = compose(
  withRouter,
  injectIntl,
);

export default enhance(HistoryNavigation);

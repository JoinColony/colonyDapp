/* @flow */

import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';

import type { MessageDescriptor, IntlShape } from 'react-intl';
import type { IBrowserHistory } from 'history';

import Icon from '~core/Icon';
import NavLink from '~core/NavLink';

import styles from './HistoryNavigation.css';

const displayName = 'pages.NavigationBar.HistoryNavigation';

const MSG = defineMessages({
  backHistoryLink: {
    id: `pages.NavigationBar.HistoryNavigation.backHistoryLink`,
    defaultMessage: 'Go back',
  },
});

type Props = {
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
  backTextValues?: Object,
  /*
   * Browser history object injected so that we can access the previous route
   */
  history: IBrowserHistory,
  /*
   * Internationalization library object, injected by `react-intl`
   */
  intl: IntlShape,
};

const HistoryNavigation = ({
  history,
  backRoute,
  backText,
  backTextValues,
  intl: { formatMessage },
}: Props) => {
  let linkText: string = formatMessage(MSG.backHistoryLink);
  if (backText) {
    linkText =
      typeof backText === 'string'
        ? backText
        : formatMessage(backText, backTextValues);
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
        <button className={styles.back} type="button" onClick={history.goBack}>
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

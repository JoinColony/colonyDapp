import {
  IntlShape,
  MessageDescriptor,
  MessageValues,
  defineMessages,
  injectIntl,
} from 'react-intl';
import React from 'react';
import { useHistory } from 'react-router-dom';

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

interface Props {
  /*
   * If set, the the back link will redirect back to a specific route
   */
  backRoute?: string;

  /*
   * If set, it will change the default back link text
   */
  backText?: string | MessageDescriptor;

  /*
   * Works in conjuction with the above to provide message descriptor selector values
   */
  backTextValues?: MessageValues;

  /*
   * Internationalization library object, injected by `react-intl`
   */
  intl: IntlShape;

  /*
   * If you would like to stay at the same route but handle the navigation manually
   * a custom handler can be used i.e. switching to another wizard step
   */
  customHandler?: () => boolean;
}

const HistoryNavigation = ({
  backRoute,
  backText,
  backTextValues,
  intl: { formatMessage },
  customHandler,
}: Props) => {
  const history = useHistory();
  let linkText: string = formatMessage(MSG.backHistoryLink);
  if (backText) {
    linkText =
      typeof backText === 'string'
        ? backText
        : formatMessage(backText, backTextValues);
  }
  return (
    <div>
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
          onClick={() =>
            customHandler && customHandler() ? undefined : history.goBack()
          }
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

export default injectIntl(HistoryNavigation);

/* @flow */
import type { MessageDescriptor, MessageValues } from 'react-intl';
import type { Element } from 'react';

import React, { cloneElement } from 'react';
import { defineMessages } from 'react-intl';

import Alert from '~core/Alert';
import HistoryNavigation from './HistoryNavigation.jsx';
import UserNavigation from './UserNavigation.jsx';

import { getMainClasses } from '~utils/css';
import { useSelector } from '~utils/hooks';

import { currentUsernameSelector } from '../../../users/selectors';

import styles from './NavigationWrapper.css';

const displayName = 'pages.NavigationWrapper';

const MSG = defineMessages({
  mainnetAlert: {
    id: `pages.NavigationWrapper.mainnetAlert`,
    defaultMessage:
      /* eslint-disable-next-line max-len */
      'Heads up! Colony is a beta product on the Ethereum mainnet. Please be careful.',
  },
});

type Appearance = {
  theme?: 'main' | 'transparent',
};

type Props = {|
  /*
   * If disabled, the navigation bar won't render the back link
   */
  hasBackLink?: boolean,
  /*
   * If disabled, the navigation bar won't render the user navigation
   */
  hasUserNavigation?: boolean,
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
   * Appearance object
   *
   * It's recommended you use this to keep designs standardized
   */
  appearance?: Appearance,
  /*
   * Classname to  the main themes
   *
   * Setting this will  the theme classes
   */
  className?: string,
  /*
   * Children to render in the main section.
   *
   * Seeing as this is basically a wrapper for most components,
   * this should always have a value
   */
  children: Element<*>,
|};

const NavigationWrapper = ({
  hasBackLink = true,
  hasUserNavigation = true,
  backRoute,
  backText,
  backTextValues,
  children,
  className,
  appearance = { theme: 'main' },
  /*
   * All the remaining props are passed down to the the children
   */
  ...props
}: Props) => {
  const username: ?string = useSelector(currentUsernameSelector);
  return (
    <div className={className || getMainClasses(appearance, styles)}>
      <div className={styles.wrapper}>
        <nav className={styles.navigation}>
          {hasBackLink && (
            <div className={styles.history}>
              <HistoryNavigation
                backRoute={backRoute}
                backText={backText}
                backTextValues={backTextValues}
              />
            </div>
          )}
          {hasUserNavigation && (
            <div className={styles.user}>
              <UserNavigation />
            </div>
          )}
        </nav>
        <main className={styles.content}>
          {children && cloneElement(children, { ...props })}
          {!username && (
            <div className={styles.alertBanner}>
              <Alert
                appearance={{
                  theme: 'danger',
                  borderRadius: 'round',
                }}
                text={MSG.mainnetAlert}
                isDismissible
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

NavigationWrapper.displayName = displayName;

export default NavigationWrapper;

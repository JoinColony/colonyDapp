import { MessageDescriptor } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

export { default as NavBar } from './NavBar';
export { default as SimpleNav } from './SimpleNav';
export { default as Plain } from './Plain';

// Use with caution
export { default as HistoryNavigation } from './HistoryNavigation';

export interface RouteComponentProps {
  /*
   * If disabled, the navigation bar won't render the back link
   */
  hasBackLink?: boolean;

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
  backTextValues?: SimpleMessageValues;

  /*
   * Classname to  the main themes
   *
   * Setting this will  the theme classes
   */
  className?: string;
}

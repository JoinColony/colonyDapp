import React, { useCallback } from 'react';
import { defineMessages } from 'react-intl';

import ActionsList, {
  ClickHandlerProps as RedirectHandlerProps,
} from '~core/ActionsList';
import { Colony } from '~data/index';

import styles from './ColonyActions.css';

/*
 * @TODO Replace with actual data (fetch from events most likely?)
 */
import { MOCK_ACTIONS } from './mockData';

// const MSG = defineMessages({
//   text: {
//     id: 'dashboard.ColonyActions.text',
//     defaultMessage: 'Text',
//   },
// });

type Props = {
  colony: Colony;
};

const displayName = 'dashboard.ColonyActions';

const ColonyActions = ({ colony }: Props) => {
  /*
   * @TODO This callback should handle what happends when clicking on an
   * item in the actions list.
   *
   * It should, in theory, redirect to a route that will render the full page
   * action
   *
   * This will only happen when UAC lands
   */
  const handleActionRedirect = useCallback(
    ({ id }: RedirectHandlerProps) =>
      // eslint-disable-next-line no-console
      console.log(
        'This will redirect to the specific action item route whn UAC lands',
        id,
      ),
    [],
  );
  return (
    <div className={styles.main}>
      <ActionsList
        items={MOCK_ACTIONS}
        handleItemClick={handleActionRedirect}
      />
    </div>
  );
};

ColonyActions.displayName = displayName;

export default ColonyActions;

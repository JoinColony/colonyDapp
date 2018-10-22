/* @flow */

import React from 'react';
import { withRouter } from 'react-router-dom';

// import { defineMessages } from 'react-intl';

// import Icon from '~core/Icon';
// import NavLink from '~core/NavLink';

// import styles from './HistoryNavigation.css';

const displayName = 'user.NavigationBar.HistoryNavigation';

// const MSG = defineMessages({
//   dashboardTitle: {
//     id: `${displayName}.dashboardTitle`,
//     defaultMessage: 'Go to your Dashboard',
//   },
// });

// type Props = {};

const HistoryNavigation = () => <div>Go back!</div>;

HistoryNavigation.displayName = displayName;

export default withRouter(HistoryNavigation);

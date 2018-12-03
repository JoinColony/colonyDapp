/* @flow */

import { connect } from 'react-redux';

import Dashboard from './Dashboard.jsx';

import currentUser from '~users/AvatarDropdown/__datamocks__/mockUser';

import { currentColony } from '../../../core/selectors';

const enhance = connect(
  state => ({
    currentColony: currentColony(state),
    /*
     * @TODO add real logic here, as currently we hard code it for display purpouses
     */
    currentUser,
    userClaimedProfile: false,
  }),
  null,
);

export default enhance(Dashboard);

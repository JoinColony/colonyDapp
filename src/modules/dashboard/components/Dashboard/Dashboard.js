/* @flow */

import { compose, withProps } from 'recompose';

import Dashboard from './Dashboard.jsx';

import userMock from '~users/AvatarDropdown/__datamocks__/mockUser';

const enhance = compose(
  withProps(() => {
    const user = userMock;
    return {
      currentUser: user,
      /*
       * @TODO Add real logic here, as currently we hard code it for display purpouses
       */
      userClaimedProfile: false,
    };
  }),
);

export default enhance(Dashboard);

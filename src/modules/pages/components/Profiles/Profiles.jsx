/* @flow */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ViewProfile from '../../../profiles/components/ViewProfile';
import MyProfile from '../../../profiles/components/MyProfile';
import type { Match } from '~types/navigation';

const Profiles = ({ match }: { match: Match }) => (
  <div>
    <h1>Profiles</h1>

    <Switch>
      <Route path={`${match.url}/me`} component={MyProfile} />
      <Route path={`${match.url}/:profileID`} component={ViewProfile} />
    </Switch>
  </div>
);

export default Profiles;

/* @flow */
import React from 'react';
import ViewProfile from './ViewProfile.jsx';
import type { Match } from '../../../../types/navigation';

const ViewProfileContainer = ({ match }: { match: Match }) => (
  <ViewProfile profileID={match.params.profileID} />
);

export default ViewProfileContainer;

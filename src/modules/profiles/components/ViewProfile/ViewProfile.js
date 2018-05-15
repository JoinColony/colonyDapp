/* @flow */
import React from 'react';
import ViewProfile from './ViewProfile.jsx';

const ViewProfileContainer = ({ match }) => (
  <ViewProfile profileID={match.params.profileID}/>
)

export default ViewProfileContainer;


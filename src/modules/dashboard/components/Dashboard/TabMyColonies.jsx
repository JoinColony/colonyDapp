/* @flow */

import type { List } from 'immutable';

import React from 'react';
import { connect } from 'react-redux';

import ColonyGrid from '~core/ColonyGrid';

import { allColonies } from '../../selectors';

import type { ColonyRecord } from '~types';

type Props = {
  colonies: List<ColonyRecord>,
};

// TODO This is little more than a placeholder at the moment.
const TabMyColonies = ({ colonies }: Props) =>
  colonies && colonies.size ? (
    <ColonyGrid colonies={colonies} />
  ) : (
    <h2>No colonies yet :-(</h2>
  );

export default connect(state => ({ colonies: allColonies(state) }))(
  TabMyColonies,
);

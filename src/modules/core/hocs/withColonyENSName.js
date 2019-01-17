/* @flow */

import { connect } from 'react-redux';
import { compose, branch, lifecycle } from 'recompose';

import { colonyENSNameSelector } from '../../dashboard/selectors';
import { fetchColonyENSName as fetchColonyENSNameAction } from '../../dashboard/actionCreators';

const withColonyENSName = compose(
  connect(
    (state, props) => ({
      ensName: colonyENSNameSelector(state, props),
    }),
    {
      fetchColonyENSName: fetchColonyENSNameAction,
    },
  ),
  branch(
    ({ ensName }) => !ensName,
    lifecycle({
      componentDidMount() {
        const { colonyAddress, fetchColonyENSName } = this.props;
        fetchColonyENSName(colonyAddress);
      },
    }),
  ),
);

export default withColonyENSName;

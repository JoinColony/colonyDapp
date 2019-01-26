/* @flow */
import type { HOC } from 'recompose';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { allTransactions } from '../../../core/selectors';

const enhance: HOC<*, *> = compose(
  connect((state: Object) => ({
    // TODO: sorting?? In the selector maybe?
    transactions: allTransactions(state)
      .toList()
      .toJS(),
  })),
);

export default enhance;

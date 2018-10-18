/* @flow */

import { compose, withHandlers, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';
import { sortObjectsBy } from '~utils/arrays';

import Tokens from './Tokens.jsx';

import mockTokens from './__datamocks__/mockTokens';

const isEthSort = (prev: string, next: string): number => {
  const prevVal = prev.toLowerCase();
  const nextVal = next.toLowerCase();
  if (prevVal === 'eth' || nextVal === 'eth') {
    return prevVal === 'eth' ? -1 : 1;
  }
  return 0;
};

const enhance = compose(
  withDialog(),
  withProps(() => ({
    tokens: mockTokens.sort(
      sortObjectsBy(
        'isNative',
        { name: 'tokenSymbol', compareFn: isEthSort },
        'id',
      ),
    ),
  })),
  withHandlers({
    handleOpenTokenEditDialog: ({ openDialog, tokens }) => () => {
      openDialog('TokenEditDialog', { tokens });
    },
  }),
);

export default enhance(Tokens);

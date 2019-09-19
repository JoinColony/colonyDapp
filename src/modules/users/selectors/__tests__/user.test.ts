import { List, fromJS } from 'immutable';
import { InboxItem } from '~immutable/index';
import { USERS_NAMESPACE as ns, USERS_INBOX_ITEMS } from '../../constants';

import { inboxItemsSelector } from '../user';

jest.mock('../../../users/selectors', () => ({
  walletAddressSelector: () => '0xdeadbeef',
}));

describe('Transaction selectors', () => {
  const activity1 = {
    id: 'rS0zYDCGtRaYAks7qTX3X',
    type: 'iceCreamInTheFridge',
    timestamp: '2019-05-24T11:09:15.980Z',
    sourceType: 'test',
    sourceId: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    actorId: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    unread: false,
    context: {
      colonyName: 're',
      colonyAddress: '0xEc46E0d7208FF021CDb5B9D47196adb8bbe07a3D',
    },
  };
  const activity2 = {
    id: 'rS0AAADCGtRaYAks7qTX3X',
    type: 'dinnerIsReady',
    timestamp: '2019-05-24T13:09:15.980Z',
    sourceType: 'test',
    sourceId: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    actorId: '0xb77D57F4959eAfA0339424b83FcFaf9c15407461',
    unread: false,
    context: {
      colonyName: 're',
      colonyAddress: '0xEc46E0d7208FF021CDb5B9D47196adb8bbe07a3D',
    },
  };

  const state = fromJS({
    [ns]: {
      currentUser: {
        [USERS_INBOX_ITEMS]: List([
          InboxItem(fromJS(activity1)),
          InboxItem(fromJS(activity2)),
        ]),
      },
    },
  });

  test('inboxItems selector', () => {
    const found = inboxItemsSelector(state);
    const result = found.toJS();
    expect(result[1].context.colonyAddress).toEqual(
      '0xEc46E0d7208FF021CDb5B9D47196adb8bbe07a3D',
    );
    expect(result[1].type).toEqual('dinnerIsReady');
  });
});

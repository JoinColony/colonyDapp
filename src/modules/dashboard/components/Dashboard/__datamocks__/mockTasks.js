/* @flow */

import BigNumber from 'bn.js';

const mockTasks = [
  {
    id: 1,
    title: 'Develop Github integration',
    reputation: new BigNumber('19.005'),
    payout: [
      { symbol: 'CLNY', amount: new BigNumber('6.00') },
      { symbol: 'ETH', amount: new BigNumber('2.00105') },
      { symbol: 'DAI', amount: new BigNumber('1.001') },
    ],
    assignee: '0xdeadbeef',
  },
  {
    id: 2,
    title: 'Write docs for JS library',
    reputation: new BigNumber('3.5'),
    payout: [{ symbol: 'ETH', amount: new BigNumber('7') }],
    assignee: '0xbeefdead',
  },
  {
    id: 3,
    title: 'Conduct user interviews on lo-fi prototypes',
    reputation: new BigNumber(5),
    payout: [
      { symbol: 'ETH', amount: new BigNumber('2.00105') },
      { symbol: 'DAI', amount: new BigNumber('4.001') },
    ],
    assignee: '0xfeedbeef',
  },
  {
    id: 4,
    title: 'Create ux prototype of an Ethereum wallet',
    reputation: new BigNumber(8),
    payout: [
      { symbol: 'CLNY', amount: new BigNumber('1.00') },
      { symbol: 'ETH', amount: new BigNumber('9.00105') },
    ],
    assignee: '0xdeadbeef',
  },
  {
    id: 5,
    title: 'Translate Colony whitepaper',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'CLNY', amount: new BigNumber('1.00') }],
    assignee: '0xdeadbeef',
  },
  {
    id: 6,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 7,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 8,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 9,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 10,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 11,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 12,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 13,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 14,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
  {
    id: 15,
    title: '5 week open developer project',
    reputation: new BigNumber(1),
    payout: [{ symbol: 'ETH', amount: new BigNumber('1.00') }],
    assignee: '0xfeedbeef',
  },
];

export default mockTasks;

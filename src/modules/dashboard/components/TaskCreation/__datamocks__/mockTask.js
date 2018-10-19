/* @flow */

const mockTask = {
  id: 1,
  title: 'Develop Github integration',
  reputation: 19.5,
  payouts: [
    { symbol: 'COOL', amount: 600 },
    { symbol: 'ETH', amount: 200105 },
    { symbol: 'DAI', amount: 1001 },
    { symbol: 'CLNY', amount: 600 },
  ],
  creator: '0x1afb213afa8729fa7908154b90e256f1be70989b',
  assignee: {
    walletAddress: '0x1afb213afa8729fa7908154b90e256f1be70989a',
    username: 'user',
  },
};

export default mockTask;

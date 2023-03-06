export enum SignOption {
  Individual = 'Individual',
  Multiple = 'Multiple',
}

export enum VerificationStatus {
  Verified = 'Verified',
  Unverified = 'Unverified',
}
// this is a mock data
export const cost = {
  initial: {
    token: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 6,
      iconHash: '',
      id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    amount: '5300000000',
  },
  reneval: {
    token: {
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 6,
      iconHash: '',
      id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd5823',
      name: 'USD Coin',
      symbol: 'USDC',
    },
    amount: '3800000000',
  },
};

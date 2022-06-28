import {
  JsonRpcProvider,
  BlockTag,
  TransactionRequest,
} from 'ethers/providers';
import { poll, serializeTransaction, resolveProperties } from 'ethers/utils';

type CachedRPCResponse = {
  response: Promise<string>;
  timestamp: number;
};

export class ExtendedJsonRpcProvider extends JsonRpcProvider {
  _parentGetCode: (
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ) => Promise<string>;

  _parentCall: (
    transaction: TransactionRequest,
    blockTag?: BlockTag | Promise<BlockTag>,
  ) => Promise<string>;

  cachedData: { [key: string]: CachedRPCResponse } = {};

  constructor(...args) {
    super(...args);
    this._parentGetCode = super.getCode;
    this._parentCall = super.call;
    this.cachedData = {};
  }

  async call(
    transaction: TransactionRequest,
    blockTag?: BlockTag | Promise<BlockTag>,
  ): Promise<string> {
    const tx = await resolveProperties(transaction);

    const { from } = tx;
    delete tx.from;
    const key = `${serializeTransaction(tx)}:${from || ''}`;

    if (
      this.cachedData[key] &&
      this.cachedData[key].timestamp > Date.now() - 60000
    ) {
      return this.cachedData[key].response;
    }

    this.cachedData[key] = {
      timestamp: Date.now(),
      response: this._parentCall(transaction, blockTag),
    };

    return this.cachedData[key].response;
  }

  getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ): Promise<string> {
    return poll(
      async () => {
        const result = await this._parentGetCode(addressOrName, blockTag);
        if (result === '0x') {
          return undefined;
        }
        return result;
      },
      {
        timeout: 10000,
      },
    );
  }
}

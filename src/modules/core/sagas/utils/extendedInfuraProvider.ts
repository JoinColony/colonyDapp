import { InfuraProvider, BlockTag } from 'ethers/providers';
import { poll } from 'ethers/utils';

export class ExtendedInfuraProvider extends InfuraProvider {
  _parentGetCode: (
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ) => Promise<string>;

  constructor(...args) {
    super(...args);
    this._parentGetCode = super.getCode;
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

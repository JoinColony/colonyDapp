import { JsonRpcProvider, BlockTag } from 'ethers/providers';
import { poll } from 'ethers/utils';

export class ExtendedJsonRpcProvider extends JsonRpcProvider {
  getCode(
    addressOrName: string | Promise<string>,
    blockTag?: BlockTag | Promise<BlockTag>,
  ): Promise<string> {
    return poll(
      async () => {
        const result = await super.getCode(addressOrName, blockTag);
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

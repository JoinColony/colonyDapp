import { BigNumber } from 'ethers/utils';

declare module 'move-decimal-point' {
  function moveDecimal(
    value: string | number | BigNumber,
    moveBy: number,
  ): string;
  export = moveDecimal;
}

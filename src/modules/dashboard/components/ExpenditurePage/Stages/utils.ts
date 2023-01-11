import { BigNumber, bigNumberify } from 'ethers/utils';
import {
  isArray,
  isBoolean,
  isEmpty,
  isNumber,
  isPlainObject,
  isString,
} from 'lodash';
import moveDecimal from 'move-decimal-point';

import { Colony } from '~data/index';
import { getTokenDecimalsWithFallback } from '~utils/tokens';

import { FundingSource, Rate } from '../Streaming/types';

export const flattenObject = (
  o: any,
  prefixParameter?: string,
  resultParameter?: any,
) => {
  const prefix = prefixParameter || '';
  const result = resultParameter || {};

  if (isString(o) || isNumber(o) || isBoolean(o)) {
    result[prefix] = o;
    return result;
  }

  if (isArray(o) || isPlainObject(o)) {
    Object.keys(o).forEach((key) => {
      let pref = prefix;
      if (isArray(o)) {
        pref += `[${key}]`;
      } else if (isEmpty(prefix)) {
        pref = key;
      } else if (key === 'id' || key === 'defaultMessage' || key === 'date') {
        pref = prefix;
      } else {
        pref = `${prefix}.${key}`;
      }

      flattenObject(o[key], pref, result);
    });
  }

  return result;
};

export interface RateWithAmount extends Omit<Rate, 'amount'> {
  amount: BigNumber;
}
export const calcTokensFromRates = ({
  rates,
  colony,
}: {
  rates: (Rate | RateWithAmount)[];
  colony?: Colony;
}) => {
  return rates?.reduce<RateWithAmount[]>((acc, curr) => {
    const tokenObj = colony?.tokens?.find(
      (tokenItem) => tokenItem.id === curr.token,
    );
    /*
     * Amount can be of string or BigNumber type. If it's a string, then it needs to be converted to BigNumber.
     */
    const convertedAmount =
      typeof curr.amount === 'string'
        ? bigNumberify(
            moveDecimal(
              curr.amount,
              getTokenDecimalsWithFallback(tokenObj?.decimals),
            ),
          )
        : curr.amount || bigNumberify(0);
    /*
     * Check if the token has already been added. If so, add up the amount.
     * If not added, add the entire token object to the array.
     */
    const isTokenAdded = acc.find((rateItem) => rateItem.token === curr.token);
    return isTokenAdded
      ? acc.map((accItem) =>
          accItem.token === curr.token
            ? {
                ...accItem,
                amount: accItem.amount.add(convertedAmount),
              }
            : accItem,
        )
      : [...acc, { ...curr, amount: convertedAmount }];
  }, []);
};

export const calculateTokens = ({
  funds,
  colony,
}: {
  funds?: FundingSource[];
  colony?: Colony;
}) => {
  if (!funds) {
    return undefined;
  }
  /*
   * Create an array with all available rates.
   */
  const rates = funds.map((fundItem) => fundItem.rates).flat();

  return calcTokensFromRates({ rates, colony });
};

export const convertToRate = (rates: RateWithAmount[]) => {
  return rates.map((item) => ({ ...item, amount: item.amount.toString() }));
};

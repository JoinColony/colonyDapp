import React from 'react';
import { nanoid } from 'nanoid';
import classnames from 'classnames';

import { defaultTransaction } from '~dashboard/Dialogs/ControlSafeDialog/ControlSafeDialog';
import { omit } from '~utils/lodash';
import { getArrayFromString } from '~utils/safes';
import {
  extractParameterName,
  extractParameterType,
} from '~utils/safes/getContractUsefulMethods';
import Numeral from '~core/Numeral';

import {
  DefaultArgument,
  InvisibleCopyableMaskedAddress,
  ContractSectionProps,
} from '../../DetailsWidgetSafeTransaction';

import widgetStyles from '../../DetailsWidget.css';
import styles from '../DetailsWidgetSafeTransaction.css';

type FunctionsSectionProps = Pick<ContractSectionProps, 'transaction'>;

export const FunctionsSection = ({ transaction }: FunctionsSectionProps) => {
  const functions = Object.entries(
    omit(transaction, Object.keys(defaultTransaction)),
  );

  const formatArgument = (
    type: string,
    argument: string,
    isArrayType: boolean,
  ) => {
    // only display first level of array
    const getFormattedArray = (
      paramType: string,
      fnArgument: string,
    ): string | JSX.Element[] => {
      if (fnArgument[0] !== '[' || fnArgument[fnArgument.length - 1] !== ']') {
        return fnArgument;
      }

      const arg = getArrayFromString(fnArgument);
      return arg.map((item) => {
        // If array is nesting one or more other arrays
        if (item[0] === '[' && item[item.length - 1] === ']') {
          return <DefaultArgument argument={item} key={nanoid()} />;
        }
        return formatArgument(paramType, item, false) as JSX.Element;
      });
    };

    if (isArrayType) {
      const formattedArgs = getFormattedArray(type, argument);
      if (!Array.isArray(formattedArgs)) {
        return <DefaultArgument argument={formattedArgs} key={nanoid()} />;
      }

      return formattedArgs.map((element, idx) => {
        return (
          <div className={styles.arrayItem} key={nanoid()}>
            <div className={widgetStyles.label}>
              <span>
                <Numeral value={idx} />:
              </span>
            </div>
            <div className={widgetStyles.value}>{element}</div>
          </div>
        );
      });
    }

    switch (true) {
      case type.includes('address'):
        return (
          <InvisibleCopyableMaskedAddress
            address={argument.trim()}
            key={nanoid()}
          />
        );
      case type.includes('int'):
        return <Numeral value={argument} key={nanoid()} />;
      default:
        return <DefaultArgument argument={argument} key={nanoid()} />;
    }
  };

  return (
    <>
      {functions.map(([parameter, argument], i) => {
        const paramName = extractParameterName(
          parameter,
          transaction.contractFunction,
          transaction.functionParamTypes?.[i],
        );
        const paramType = extractParameterType(paramName);
        const isArrayType = paramType.substring(paramType.length - 2) === '[]';

        return (
          <div className={widgetStyles.item} key={nanoid()}>
            <div className={widgetStyles.label}>
              <span>{paramName}</span>
            </div>
            <div
              className={classnames(widgetStyles.value, {
                [styles.arrayContainer]: isArrayType,
              })}
            >
              {formatArgument(paramType, argument as string, isArrayType)}
            </div>
          </div>
        );
      })}
    </>
  );
};

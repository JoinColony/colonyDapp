import React, {
  useCallback,
  useState,
  InputHTMLAttributes,
  useMemo,
  RefObject,
  useEffect,
} from 'react';
import { defineMessages } from 'react-intl';
import Cleave from 'cleave.js/react';
import { CleaveOptions } from 'cleave.js/options';
import { ChangeEvent } from 'cleave.js/react/props';

import { isNil } from 'lodash';
import Button from '~core/Button';

import { getMainClasses } from '~utils/css';

import styles from './InputComponent.css';

const MSG = defineMessages({
  max: {
    id: `users.Fileds.Input.InputComponent.max`,
    defaultMessage: 'Max',
  },
});

export type Appearance = {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  align?: 'right';
  colorSchema?: 'dark' | 'grey' | 'transparent' | 'info';
  size?: 'small' | 'medium';
};

type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

interface MaxButtonParams {
  setFieldValue: (field, value) => void;
  maxAmount: string;
  fieldName: string;
}

export interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'form'> {
  /** Appearance object */
  appearance?: Appearance;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Input field name (form variable) */
  name: string;

  /** Pass a ref to the `<input>` element */
  innerRef?: RefObject<any> | ((ref: HTMLInputElement | null) => void);

  /** Pass params to a max button - implemented only in Cleave options */
  maxButtonParams?: MaxButtonParams;
}

const InputComponent = ({
  appearance,
  formattingOptions,
  innerRef,
  onChange,
  placeholder,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  // Cleave TS defs don't expect/allow these
  contentEditable,
  draggable,
  spellCheck,
  maxLength,
  value,
  maxButtonParams,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props) => {
  /* problem with cleave types, that's why `any` */
  const [cleave, setCleave] = useState<any>(null);

  const length = value ? value.toString().length : 0;

  const handleCleaveChange = useCallback(
    (evt: ChangeEvent<CleaveHTMLInputElement>): void => {
      // We are reassigning the value here as cleave just adds a `rawValue` prop
      if (evt.currentTarget !== undefined) {
        // eslint-disable-next-line no-param-reassign
        evt.currentTarget.value = evt.currentTarget.rawValue;
      } else {
        // setCleaveValue(evt.currentTarget?.rawValue);
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        evt.currentTarget = {
          // @ts-ignore
          value: evt.currentTarget?.rawValue as string,
        };
      }
      if (onChange) onChange(evt);
    },
    [onChange],
  );
  /*
   * @NOTE Coerce cleave into handling dynamically changing options
   * See here for why this isn't yet supported "officially":
   * https://github.com/nosir/cleave.js/issues/352#issuecomment-447640572
   */
  const dynamicCleaveOptionKey = useMemo(
    () => JSON.stringify(formattingOptions),
    [formattingOptions],
  );

  useEffect(() => {
    if (isNil(value) && cleave) {
      cleave.setRawValue('');
    }
  }, [cleave, value]);

  if (formattingOptions) {
    if (typeof innerRef === 'object') {
      console.error('Cleave inner ref must be a function');
      return null;
    }
    return maxButtonParams === undefined ? (
      <Cleave
        {...props}
        key={dynamicCleaveOptionKey}
        className={getMainClasses(appearance, styles)}
        htmlRef={innerRef}
        options={formattingOptions}
        onChange={handleCleaveChange}
        placeholder={placeholder}
      />
    ) : (
      <div className={styles.inputContainer}>
        <Button
          className={styles.maxButton}
          text={MSG.max}
          onClick={() => {
            maxButtonParams?.setFieldValue(
              maxButtonParams?.fieldName,
              maxButtonParams.maxAmount,
            );
            cleave?.setRawValue(Number(maxButtonParams.maxAmount));
          }}
        />
        <Cleave
          {...props}
          key={dynamicCleaveOptionKey}
          className={getMainClasses(appearance, styles)}
          htmlRef={innerRef}
          options={formattingOptions}
          onChange={handleCleaveChange}
          placeholder={placeholder}
          onInit={(cleaveInstance) => setCleave(cleaveInstance)}
        />
      </div>
    );
  }

  return !maxLength ? (
    <input
      className={getMainClasses(appearance, styles)}
      onChange={onChange}
      placeholder={placeholder}
      ref={innerRef}
      value={value || ''}
      {...props}
    />
  ) : (
    <div className={styles.inputContainer}>
      <input
        className={getMainClasses(
          { paddingRight: 'extra', ...appearance },
          styles,
        )}
        onChange={onChange}
        placeholder={placeholder}
        ref={innerRef}
        maxLength={maxLength}
        value={value || ''}
        {...props}
      />
      {maxLength && (
        <span className={styles.characterCounter}>
          {length}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default InputComponent;

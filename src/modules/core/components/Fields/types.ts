import { HTMLAttributes } from 'react';
import { MessageDescriptor } from 'react-intl';
import { FieldProps, FieldInputProps } from 'formik';

import { SimpleMessageValues } from '../../../../types/index';

export type FormatMessage = (
  messageDescriptor: MessageDescriptor,
  values?: SimpleMessageValues,
) => string;

export interface AsFieldConfig {
  alwaysConnected?: boolean;
  validate?: (value: any) => boolean;
  initialValue?: string;
}

export interface AsFieldEnhancedProps<
  T extends HTMLAttributes<HTMLElement> | never = HTMLAttributes<HTMLElement>
>
  extends Pick<
    T,
    'aria-invalid' | 'aria-label' | 'aria-labelledby' | 'onBlur' | 'onChange'
  > {
  connect: boolean;
  elementOnly?: boolean;
  label: string;
  help?: string;
  name: string;
  placeholder?: string;
  status?: string;
  title?: string;
  $id: string;
  $error: string | undefined;
  $value: any;
  $touched: boolean;
  isSubmitting?: boolean;
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: SimpleMessageValues,
  ) => string | undefined;
  setError?: (errorMessage: string | MessageDescriptor) => void;
  setValue?: (val: any) => void;
}

export interface ExtraFieldProps {
  connect?: boolean;
  elementOnly?: boolean;
  help?: string | MessageDescriptor;
  helpValues?: SimpleMessageValues;
  id?: string;
  label?: string | MessageDescriptor;
  labelValues?: SimpleMessageValues;
  onBlur?: FieldInputProps<any>['onBlur'];
  onChange?: FieldInputProps<any>['onChange'];
  name: string;
  placeholder?: string | MessageDescriptor;
  status?: string | MessageDescriptor;
  statusValues?: SimpleMessageValues;
  title?: string | MessageDescriptor;
  $value?: any;
  form?: Partial<FieldProps<any>['form']>;
  field?: Partial<FieldProps<any>['field']>;
}

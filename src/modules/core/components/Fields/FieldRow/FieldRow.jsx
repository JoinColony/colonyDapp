/* @flow */

import React, { Component } from 'react';
import type { ComponentType } from 'react';
import type { FieldProps } from 'redux-form';
import type { Appearance } from '$types/css';

import type { FieldComponentProps, Option, Utils } from '../flowTypes';

type Props = FieldProps & {
  appearance?: Appearance,
  elementOnly?: boolean,
  fieldComponent: ComponentType<FieldComponentProps<>>,
  help: string,
  id: string,
  immediateValidation?: boolean,
  label: string,
  name: string,
  options?: Array<Option>,
  placeholder: string,
  utils: Utils,
  title: string,
};

class FieldRow extends Component<Props> {
  reset: () => void;
  static displayName = 'core.Field.FieldRow';
  constructor(props: Props) {
    super(props);
    this.reset = this.reset.bind(this);
  }
  reset() {
    const { input: { onChange } } = this.props;
    onChange('');
  }
  render() {
    const {
      appearance,
      custom,
      elementOnly,
      fieldComponent: FieldComponent,
      help,
      id,
      immediateValidation,
      input,
      label,
      meta,
      options,
      placeholder,
      utils,
      title,
      ...props
    } = this.props;

    const { touched, pristine, error } = meta;
    const hasError = !!(error && (touched || (immediateValidation && !pristine)));

    const inputProps = {
      id,
      placeholder,
      title: hasError ? (error || title) : title,
    };

    return (
      <FieldComponent
        appearance={appearance}
        custom={custom}
        elementOnly={elementOnly}
        error={error}
        hasError={hasError}
        help={help}
        input={input}
        inputProps={inputProps}
        label={label}
        meta={meta}
        options={options}
        passthroughProps={props}
        utils={{
          ...utils,
          reset: utils.reset || this.reset,
        }}
      />
    );
  }
}
export default FieldRow;

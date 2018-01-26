/* @flow */

import React, { Component } from 'react';
import type { ComponentType } from 'react';
import PropTypes from 'prop-types';
import { Field as ReduxFormField } from 'redux-form';
import type { IntlShape, MessageDescriptor } from 'react-intl';
import shortid from 'shortid';

import type { Appearance } from '~types/css';

import type { FieldComponentProps, Option } from '../flowTypes';

import FieldRow from '../FieldRow';
import StandaloneField from '../StandaloneField';

/**
 * Component to easily create Field components that are connected to redux-form
 *
 * @method Field

 * Components wrapped as a Field *get* the following props:
 *
 * @param {object} appearance Object to set the Fields appearance
 * @param {bool} elementOnly Set to just display the `input` element w/o it's label
 * @param {any} error The error message to display in case of non-valid values, can be set to a messageDescriptor
 * @param {bool} hasError Used to determine if to the error message is to be shown
 * @param {string|object} help The help message to display, can be set to a messageDescriptor (optional)
 * @param {string} input Holds all the properties that the actual input element should get (think: redux-forms input but enhanced)
 * @param {string|object} label The label of the `input` field, can be set to a messageDescriptor
 * @param {array} options Options for radio groups
 * @param {func} reset Reset method provided by `redux-form`.
 */

type Props = {
  appearance?: Appearance,
  component: ComponentType<FieldComponentProps<>>,
  elementOnly?: boolean,
  help?: MessageDescriptor | string,
  id?: string,
  intl: IntlShape,
  label?: MessageDescriptor | string,
  name: string,
  options?: Array<Option>,
  placeholder?: MessageDescriptor | string,
  standalone?: boolean,
  title?: MessageDescriptor | string,
  reset?: () => void,
};

class Field extends Component<Props> {
  id: string;
  static displayName = 'core.Fields.Field';
  static contextTypes = {
    _reduxForm: PropTypes.object,
  };
  componentWillMount() {
    const { _reduxForm } = this.context;
    const { elementOnly, id, label, name } = this.props;
    this.id = _reduxForm ? `${_reduxForm.form}_${name}_${shortid.generate()}` : `${name}_${shortid.generate()}`;
    if (elementOnly && !label && !id) {
      throw new Error('You have to specify an id when using an external label');
    }
  }
  getId = (): string => this.props.id || this.id;
  getIntlFormatted = (prop?: MessageDescriptor | string, values?: { [string]: string }): string => {
    const { intl: { formatMessage } } = this.props;
    if (!prop) {
      return '';
    }
    if (typeof prop == 'string') {
      return prop;
    }
    return formatMessage(prop, values);
  }
  getLabel = (): string => {
    const { label } = this.props;
    return this.getIntlFormatted(label);
  }
  getTitle = (): string => {
    const { label, placeholder, title } = this.props;
    return this.getIntlFormatted(title) || this.getIntlFormatted(label) || this.getIntlFormatted(placeholder);
  }
  getConnectorComponent = (): (ComponentType<any> | Function | string) => {
    const { standalone } = this.props;
    return standalone ? StandaloneField : ReduxFormField;
  }
  render() {
    const {
      component,
      help,
      intl,
      options,
      placeholder,
      reset,
      standalone,
      ...props
    } = this.props;

    const ConnectorComponent = this.getConnectorComponent();
    const connectorProps = {
      ...props,
      fieldComponent: component,
      help: this.getIntlFormatted(help),
      id: this.getId(),
      label: this.getLabel(),
      options: options && options.map(option => ({ ...option, label: this.getIntlFormatted(option.label) })),
      placeholder: this.getIntlFormatted(placeholder),
      utils: {
        getIntlFormatted: this.getIntlFormatted,
        reset,
      },
      title: this.getTitle(),
    };

    return (
      <ConnectorComponent
        component={FieldRow}
        {...connectorProps}
      />
    );
  }
}

export default Field;

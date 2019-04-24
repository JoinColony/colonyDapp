/* @flow */
import type { Node } from 'react';
import type {
  Editor as EditorType,
  EditorState as EditorStateType,
} from 'draft-js';
import type { MessageDescriptor, MessageValues } from 'react-intl';

import React, { Component } from 'react';
import { ContentState, Editor, EditorState } from 'draft-js';

import 'draft-js/dist/Draft.css';

import { asField, InputLabel } from '~core/Fields';
import InputStatus from '~core/Fields/InputStatus';
import { getMainClasses } from '~utils/css';

import styles from './MultiLineEdit.css';

type Appearance = {};

type Props = {|
  /** Should the return key create a new line */
  allowReturns?: boolean,
  /** Appearance object */
  appearance?: Appearance,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Extra node to render on the top right in the label */
  extra?: Node,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Input field name (form variable) */
  name: string,
  /** Placeholder for input */
  placeholder?: string | MessageDescriptor,
  /** Values for placeholder text (react-intl interpolation) */
  placeholderValues?: MessageValues,
  /** Status text */
  status?: string | MessageDescriptor,
  /** Values for status text (react-intl interpolation) */
  statusValues?: MessageValues,
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** Will be injected by `asField`, or must be supplied if unconnected */
  $value: EditorStateType,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string,
  /** Called when the editor loses focus */
  onEditorBlur?: (
    evt: SyntheticFocusEvent<EditorType>,
    editorState: EditorStateType,
  ) => void,
  /** Will be injected by `asField`, or must be manually supplied if unconnected */
  setValue: (val: any) => void,
  /** Should the editor be read only */
  readOnly?: boolean,
  /** Should spell checking be enabled */
  spellCheck?: boolean,
|};

const HANDLED = 'handled';
const NOT_HANDLED = 'not-handled';

class MultiLineEdit extends Component<Props> {
  static displayName = 'MultiLineEdit';

  static defaultProps = {
    allowReturns: true,
    elementOnly: true,
    readOnly: false,
    spellCheck: false,
  };

  editorHasContent = () => {
    const { $value: editorState } = this.props;
    const currentContent = editorState.getCurrentContent();
    return (
      currentContent.hasText() && currentContent.getPlainText().trim() !== ''
    );
  };

  handleReturn = () => {
    const { allowReturns } = this.props;
    if (!allowReturns) {
      return HANDLED;
    }
    return NOT_HANDLED;
  };

  onBlur = (evt: SyntheticFocusEvent<EditorType>) => {
    const { onEditorBlur, setValue, $value } = this.props;
    let editorState = $value;
    if (!this.editorHasContent()) {
      editorState = EditorState.push(
        editorState,
        ContentState.createFromText(''),
        'remove-range',
      );
      setValue(editorState);
    }
    if (onEditorBlur) {
      onEditorBlur(evt, editorState);
    }
  };

  onChange = (editorState: EditorStateType) => {
    const { setValue } = this.props;
    setValue(editorState);
  };

  render() {
    const {
      appearance,
      elementOnly,
      $error,
      extra,
      formatIntl,
      help,
      helpValues,
      $id,
      label,
      labelValues,
      name,
      placeholder,
      placeholderValues,
      readOnly,
      spellCheck,
      status,
      statusValues,
      $value,
    } = this.props;
    const placeholderText =
      typeof placeholder === 'object'
        ? formatIntl(placeholder, placeholderValues)
        : placeholder;
    return (
      <div className={getMainClasses(appearance, styles)}>
        {!elementOnly && (
          <InputLabel
            error={$error}
            help={help}
            helpValues={helpValues}
            extra={extra}
            label={label}
            labelValues={labelValues}
          />
        )}
        <Editor
          name={name}
          editorKey={$id}
          editorState={$value}
          handleReturn={this.handleReturn}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder={placeholderText}
          readOnly={readOnly}
          spellCheck={spellCheck}
          stripPastedStyles
        />
        <InputStatus
          status={status}
          statusValues={statusValues}
          error={$error}
        />
      </div>
    );
  }
}

export default asField({
  initialValue: EditorState.createEmpty(),
})(MultiLineEdit);

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import {
  EditorState as EditorStateType,
  ContentState,
  Editor,
  EditorState,
} from 'draft-js';
import { useField } from 'formik';
import nanoid from 'nanoid';

import 'draft-js/dist/Draft.css';

import { InputLabel } from '~core/Fields';
import InputStatus from '~core/Fields/InputStatus';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './MultiLineEdit.css';

interface Props {
  /** Should the return key create a new line */
  allowReturns?: boolean;

  /** Should hide the label from visual users */
  elementOnly?: boolean;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html `id` attribute (for label & input) */
  id?: string;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html input `name` attribute */
  name: string;

  /** Called when the editor loses focus */
  onEditorBlur?: (evt: FocusEvent, value: string) => void;

  /** Placeholder text */
  placeholder?: string | MessageDescriptor;

  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;

  /** Should the editor be read only */
  readOnly?: boolean;

  /** Should spell checking be enabled */
  spellCheck?: boolean;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Status text values for intl interpolation */
  statusValues?: SimpleMessageValues;
}

enum Return {
  Handled = 'handled',
  NotHandled = 'not-handled',
}

const createEditorState = (value: string) =>
  value
    ? EditorState.createWithContent(ContentState.createFromText(value))
    : EditorState.createEmpty();

const MultiLineEdit = ({
  allowReturns = true,
  elementOnly = true,
  extra,
  help,
  helpValues,
  id: idProp,
  label,
  labelValues,
  name,
  onEditorBlur,
  placeholder: placeholderProp,
  placeholderValues,
  readOnly = false,
  spellCheck = false,
  status,
  statusValues,
}: Props) => {
  const [id] = useState(idProp || nanoid());
  const [, { error, value }, { setValue }] = useField<string>(name);
  const { formatMessage } = useIntl();

  const [editorState, setEditorState] = useState<EditorStateType>(() =>
    createEditorState(value),
  );
  useEffect(() => setEditorState(createEditorState(value)), [value]);

  const handleReturn = useCallback(
    () => (!allowReturns ? Return.Handled : Return.NotHandled),
    [allowReturns],
  );

  const onBlur = useCallback(
    (evt: FocusEvent) => {
      const content = editorState.getCurrentContent();
      const newValue =
        (content.hasText() && content.getPlainText().trim()) || '';
      if (newValue !== value && setValue) {
        setValue(newValue);
      }
      if (onEditorBlur) {
        onEditorBlur(evt, newValue);
      }
    },
    [value, editorState, onEditorBlur, setValue],
  );

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  return (
    <div className={getMainClasses({}, styles)}>
      <InputLabel
        help={help}
        helpValues={helpValues}
        extra={extra}
        label={label}
        labelValues={labelValues}
        screenReaderOnly={elementOnly}
      />
      <Editor
        name={name}
        editorKey={id}
        editorState={editorState}
        handleReturn={handleReturn}
        onBlur={onBlur}
        onChange={setEditorState}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={spellCheck}
        stripPastedStyles
      />
      <InputStatus status={status} statusValues={statusValues} error={error} />
    </div>
  );
};

export default MultiLineEdit;

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  EditorState as EditorStateType,
  ContentState,
  Editor,
  EditorState,
} from 'draft-js';
import { MessageDescriptor, MessageValues } from 'react-intl';

import 'draft-js/dist/Draft.css';

import { asField, InputLabel } from '~core/Fields';
import InputStatus from '~core/Fields/InputStatus';
import { getMainClasses } from '~utils/css';

import styles from './MultiLineEdit.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Appearance {}

interface Props {
  /** Should the return key create a new line */
  allowReturns?: boolean;

  /** Appearance object */
  appearance?: Appearance;

  /** Just render the `<input>` element without label */
  elementOnly?: boolean;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues;

  /** Label text */
  label: string | MessageDescriptor;

  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues;

  /** Input field name (form variable) */
  name: string;

  /** Placeholder for input */
  placeholder?: string | MessageDescriptor;

  /** Values for placeholder text (react-intl interpolation) */
  placeholderValues?: MessageValues;

  /** Status text */
  status?: string | MessageDescriptor;

  /** Values for status text (react-intl interpolation) */
  statusValues?: MessageValues;

  /** @ignore Will be injected by `asField` */
  $id: string;

  /** @ignore Will be injected by `asField` */
  $error?: string;

  /** Will be injected by `asField`, or must be supplied if unconnected */
  $value: string;

  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;

  /** Called when the editor loses focus */
  onEditorBlur?: (evt: FocusEvent, value: string) => void;

  /** Will be injected by `asField`, or must be manually supplied if unconnected */
  setValue: (val: any) => void;

  /** Should the editor be read only */
  readOnly?: boolean;

  /** Should spell checking be enabled */
  spellCheck?: boolean;
}

const HANDLED = 'handled';
const NOT_HANDLED = 'not-handled';

const createEditorState = ($value: string) =>
  $value
    ? EditorState.createWithContent(ContentState.createFromText($value))
    : EditorState.createEmpty();

const MultiLineEdit = ({
  $error,
  $id,
  $value,
  allowReturns = true,
  appearance,
  extra,
  formatIntl,
  help,
  helpValues,
  label,
  labelValues,
  name,
  onEditorBlur,
  placeholder,
  placeholderValues,
  setValue,
  status,
  statusValues,
  elementOnly = true,
  readOnly = false,
  spellCheck = false,
}: Props) => {
  const [editorState, setEditorState] = useState<EditorStateType>(() =>
    createEditorState($value),
  );
  useEffect(() => setEditorState(createEditorState($value)), [$value]);
  const handleReturn = useCallback(
    () => (!allowReturns ? HANDLED : NOT_HANDLED),
    [allowReturns],
  );
  const onBlur = useCallback(
    (evt: FocusEvent) => {
      const content = editorState.getCurrentContent();
      const newValue =
        (content.hasText() && content.getPlainText().trim()) || '';
      if (newValue !== $value) {
        setValue(newValue);
      }
      if (onEditorBlur) {
        onEditorBlur(evt, newValue);
      }
    },
    [$value, editorState, onEditorBlur, setValue],
  );
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
        editorState={editorState}
        handleReturn={handleReturn}
        onBlur={onBlur}
        onChange={setEditorState}
        placeholder={placeholderText}
        readOnly={readOnly}
        spellCheck={spellCheck}
        stripPastedStyles
      />
      <InputStatus status={status} statusValues={statusValues} error={$error} />
    </div>
  );
};

export default (asField({
  initialValue: '',
}) as any)(MultiLineEdit);

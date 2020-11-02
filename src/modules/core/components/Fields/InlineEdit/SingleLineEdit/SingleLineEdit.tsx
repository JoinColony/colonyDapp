import React, {
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useField } from 'formik';
import { nanoid } from 'nanoid';

import { InputComponent } from '~core/Fields/Input';
import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './SingleLineEdit.css';

interface Props {
  /** Html `id` attribute (for label & input) */
  id?: string;

  /** The maximum length of the input value. If provided, remaining character count will be displayed */
  maxLength?: number;

  /** Html `name` attribute */
  name: string;

  /** Callback to be called on input blur */
  onBlur?: (evt: FocusEvent<HTMLInputElement>) => void;

  /** Placeholder text when the field doesn't have a value */
  placeholder?: string | MessageDescriptor;

  /** Placeholder text values for intl interpolation */
  placeholderValues?: SimpleMessageValues;

  /** Should the component be read only */
  readOnly?: boolean;
}

const displayName = 'SingleLineEdit';

const SingleLineEdit = ({
  id: idProp,
  maxLength,
  name,
  onBlur: onBlurCallback,
  placeholder: placeholderProp,
  placeholderValues,
  readOnly = false,
}: Props) => {
  const [id] = useState(idProp || nanoid());
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, _setIsEditing] = useState<boolean>(false);
  const { formatMessage } = useIntl();

  const placeholder =
    typeof placeholderProp === 'object'
      ? formatMessage(placeholderProp, placeholderValues)
      : placeholderProp;

  const [{ onBlur, onChange }, { error, value = '' }, { setValue }] = useField<
    string
  >(name);

  const setIsEditing = useCallback(
    (newIsEditing: boolean) => {
      if (readOnly) {
        if (isEditing) {
          _setIsEditing(false);
        }
        return;
      }
      _setIsEditing(newIsEditing);
      if (!newIsEditing) {
        if (value.trim() === '') {
          /*
           * This ensures the heading is always clickable to enter editing mode.
           * For instance, in the case of only spaces entered
           */
          setValue('');
        }
      }
    },
    [value, isEditing, readOnly, setValue],
  );

  const handleOnBlur = (evt: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    onBlur(evt);
    if (onBlurCallback) {
      onBlurCallback(evt);
    }
  };

  const handleOnHeadingClick = () => {
    setIsEditing(true);
  };

  const handleOnHeadingKeyUp = () => {
    setIsEditing(true);
  };

  const handleOutsideClick = useCallback(
    (evt: MouseEvent) => {
      if (
        inputRef &&
        evt.target instanceof Node &&
        !(inputRef as any).contains(evt.target)
      ) {
        setIsEditing(false);
      }
    },
    [setIsEditing],
  );

  const setInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (isEditing) {
      setInputFocus();
      if (document.body) {
        document.body.addEventListener('click', handleOutsideClick, true);
      }
    }
    return () => {
      if (document.body) {
        document.body.removeEventListener('click', handleOutsideClick, true);
      }
    };
  }, [handleOutsideClick, isEditing]);

  const inputProps = {
    'aria-invalid': !!error,
    id,
    maxLength,
    name,
    onBlur: handleOnBlur,
    onChange,
    placeholder,
    value,
  };
  return (
    <div
      className={getMainClasses({}, styles, {
        hasReachedMaxLength: value.length === maxLength,
        hasValue: !!value,
        readOnly: !!readOnly,
      })}
    >
      {isEditing ? (
        <div className={styles.inputContainer}>
          <InputComponent {...inputProps} innerRef={inputRef} />
          {!!maxLength && (
            <span className={styles.maxLengthText}>
              {value.length}/{maxLength}
            </span>
          )}
        </div>
      ) : (
        <div className={styles.notEditingValueWrapper}>
          <div
            className={styles.notEditingValueContainer}
            onClick={handleOnHeadingClick}
            onKeyUp={handleOnHeadingKeyUp}
            tabIndex={0}
            role="textbox"
          >
            <p className={styles.notEditingValue} title={value || placeholder}>
              {value || placeholder}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

SingleLineEdit.displayName = displayName;

export default SingleLineEdit;

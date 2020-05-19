import React, {
  FocusEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { asField } from '~core/Fields';
import { InputComponent } from '~core/Fields/Input';
import { Props as InputComponentProps } from '~core/Fields/Input/InputComponent';
import { FieldEnhancedProps } from '~core/Fields/types';
import { getMainClasses } from '~utils/css';

import styles from './SingleLineEdit.css';

interface Props {
  /** The maximum length of the input value. If provided, remaining character count will be displayed */
  maxLength?: number;

  /** Should the component be read only */
  readOnly?: boolean;
}

const displayName = 'SingleLineEdit';

const SingleLineEdit = ({
  $error,
  $id,
  maxLength,
  name,
  placeholder,
  readOnly = false,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  $touched,
  $value,
  connect,
  elementOnly,
  formatIntl,
  isSubmitting,
  onBlur,
  setError,
  setValue,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...rest
}: Props & FieldEnhancedProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, _setIsEditing] = useState<boolean>(false);

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
        if (setValue && $value.trim() === '') {
          /*
           * This ensures the heading is always clickable to enter editing mode.
           * For instance, in the case of only spaces entered
           */
          setValue('');
        }
      }
    },
    [$value, isEditing, readOnly, setValue],
  );

  const handleOnBlur = (evt: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    if (onBlur) {
      onBlur(evt);
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
    'aria-invalid': !!$error,
    id: $id,
    maxLength,
    name,
    onBlur: handleOnBlur,
    placeholder,
    value: $value,
    ...rest,
  };
  return (
    <div
      className={getMainClasses({}, styles, {
        hasReachedMaxLength: $value.length === maxLength,
        hasValue: !!$value,
        readOnly: !!readOnly,
      })}
    >
      {isEditing ? (
        <div className={styles.inputContainer}>
          <InputComponent {...inputProps} innerRef={inputRef} />
          {!!maxLength && (
            <span className={styles.maxLengthText}>
              {$value.length}/{maxLength}
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
            <p className={styles.notEditingValue} title={$value || placeholder}>
              {$value || placeholder}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

SingleLineEdit.displayName = displayName;

export default asField<Props, string, InputComponentProps>({
  initialValue: '',
})(SingleLineEdit);

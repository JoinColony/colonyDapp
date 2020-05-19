import React, {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { defineMessages } from 'react-intl';

import { getMainClasses } from '~utils/css';
import { DOWN, ENTER, ESC, SPACE, UP, TAB } from '~types/index';

import SelectListBox from './SelectListBox';
import { Appearance, SelectOption } from './types';
import asField from '../asField';
import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';
import { FieldEnhancedProps } from '../types';
import Icon from '../../Icon';

import styles from './Select.css';

const MSG = defineMessages({
  expandIconHTMLTitle: {
    id: 'Select.expandIconHTMLTitle',
    defaultMessage: 'expand',
  },
});

interface Props {
  /** Available `option`s for the select */
  options: SelectOption[];

  /** Appearance object */
  appearance?: Appearance;

  /** Should `select` be disabled */
  disabled?: boolean;

  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: HTMLElement | null) => void;
}

const displayName = 'Select';

const Select = ({
  appearance,
  elementOnly,
  help,
  disabled,
  $id,
  formatIntl,
  label,
  options,
  placeholder,
  name,
  status,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  $error,
  $value,
  $touched,
  setValue,
  isSubmitting,
  setError,
  connect,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props & FieldEnhancedProps) => {
  const comboboxRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(-1);

  const checkedOption = useMemo(
    () => options.findIndex((option) => option.value === $value),
    [$value, options],
  );

  const open = () => {
    if (disabled) return;
    setIsOpen(true);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedOption(-1);
    if (comboboxRef.current) {
      comboboxRef.current.focus();
    }
  }, []);

  const handleOutsideClick = useCallback(
    (evt: MouseEvent) => {
      if (
        wrapperRef.current &&
        evt.target instanceof Node &&
        !wrapperRef.current.contains(evt.target)
      ) {
        close();
      }
    },
    [close],
  );

  const goUp = () => {
    if (selectedOption > 0) {
      setSelectedOption(selectedOption - 1);
    }
  };

  const goDown = () => {
    if (selectedOption < options.length - 1) {
      setSelectedOption(selectedOption + 1);
    }
  };

  const checkOption = () => {
    if (selectedOption === checkedOption || selectedOption === -1) {
      // No change
      close();
      return;
    }
    if (setValue) {
      const { value } = options[selectedOption];
      setValue(value);
    }
    close();
  };

  const handleKeyOnOpen = (evt: KeyboardEvent<any>) => {
    const { key } = evt;
    switch (key) {
      case SPACE: {
        // prevent page long-scroll when in view
        evt.preventDefault();
        close();
        break;
      }
      case UP: {
        // prevent page scroll when in view
        evt.preventDefault();
        goUp();
        break;
      }
      case DOWN: {
        // prevent page scroll when in view
        evt.preventDefault();
        goDown();
        break;
      }
      case TAB: {
        if (checkedOption === selectedOption || selectedOption === -1) {
          // no change
          close();
        }
        checkOption();
        break;
      }
      case ENTER: {
        // Do not submit form
        evt.preventDefault();
        checkOption();
        break;
      }
      default:
    }
  };

  const handleKeyOnClosed = (evt: KeyboardEvent<HTMLElement>) => {
    const { key } = evt;
    if ([UP, DOWN, SPACE].indexOf(key) > -1) {
      evt.preventDefault();
      setSelectedOption(checkedOption);
      open();
    }
  };

  const handleKeyUp = (evt: KeyboardEvent<HTMLElement>) => {
    // Special keyUp handling for ESC (modals)
    const { key } = evt;
    if (isOpen && key === ESC) {
      evt.stopPropagation();
      close();
    }
  };

  const handleKeyDown = (evt: KeyboardEvent<HTMLElement>) => {
    if (isOpen) {
      handleKeyOnOpen(evt);
      return;
    }
    handleKeyOnClosed(evt);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  const selectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  useEffect(() => {
    if (isOpen) {
      if (document.body) {
        document.body.addEventListener('click', handleOutsideClick, true);
      }
    }
    return () => {
      if (document.body) {
        document.body.removeEventListener('click', handleOutsideClick, true);
      }
    };
  }, [handleOutsideClick, isOpen]);

  const activeOption = options[checkedOption];
  const listboxId = `select-listbox-${$id}`;
  const activeOptionLabel = formatIntl(activeOption && activeOption.label);
  // eslint-disable-next-line react/destructuring-assignment
  const ariaLabelledby = props['aria-labelledby'];
  return (
    <div className={styles.main} ref={wrapperRef}>
      {!elementOnly && label ? (
        <InputLabel inputId={$id} label={label} help={help} />
      ) : null}
      <div className={styles.inputWrapper}>
        <button
          className={`${styles.select} ${getMainClasses(appearance, styles)}`}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-expanded={isOpen}
          aria-label={formatIntl(label)}
          aria-labelledby={ariaLabelledby}
          aria-disabled={disabled}
          tabIndex={0}
          ref={comboboxRef}
          onClick={toggle}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          type="button"
          name={name}
          {...props}
        >
          <div className={styles.selectInner}>
            <div className={styles.activeOption}>
              <span>{activeOptionLabel || placeholder}</span>
            </div>
            <span className={styles.selectExpandContainer}>
              <Icon name="caret-down-small" title={MSG.expandIconHTMLTitle} />
            </span>
          </div>
        </button>
        {isOpen && !!options.length && (
          <SelectListBox
            checkedOption={checkedOption}
            selectedOption={selectedOption}
            listboxId={listboxId}
            options={options}
            onSelect={selectOption}
            onClick={checkOption}
            formatIntl={formatIntl}
            appearance={appearance}
            ariaLabelledby={ariaLabelledby}
            name={name}
          />
        )}
      </div>
      {!elementOnly && (
        <InputStatus
          appearance={{ theme: 'minimal' }}
          status={status}
          error={$error}
        />
      )}
    </div>
  );
};

Select.displayName = displayName;

Select.defaultProps = {
  appearance: { alignOptions: 'left', theme: 'default' } as Appearance,
  options: [],
};

export default asField<Props>()(Select);

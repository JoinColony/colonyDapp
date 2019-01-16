/* @flow */

import type { ComponentType } from 'react';
import type { MessageDescriptor } from 'react-intl';
import type { List as ListType } from 'immutable';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import styles from './OmniPicker.css';

import type { Choose, Data, ItemComponentType } from './types';

import OmniPickerContent from './OmniPickerContent.jsx';
import OmniPickerItemEmpty from './OmniPickerItemEmpty.jsx';

const MSG = defineMessages({
  close: {
    id: 'OmniPicker.close',
    defaultMessage: 'Esc to dismiss',
  },
  emptyMessage: {
    id: 'OmniPicker.emptyMessage',
    defaultMessage: 'Sorry, we could not find any match.',
  },
});

type Appearance = {
  position: 'top' | 'bottom',
};

type Props = {
  /** Appearance object */
  appearance: Appearance,
  /** `className` for content element */
  contentClassName?: string,
  /** Component to use for the empty state */
  emptyComponent: ComponentType<{}>,
  /** Component to use for a single item */
  itemComponent: ItemComponentType,
  /**  Called after the picker was opened */
  onOpen?: () => void,
  /** Called after the picker was closed */
  onClose?: () => void,
  /** Called when the picker is being reset */
  onReset?: () => void,
  /** Passes through the keyUp event from the input field */
  onKeyUp?: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
  /** Passes through the keyDown event from the input field */
  onKeyDown?: (evt: SyntheticKeyboardEvent<HTMLElement>) => void,
  /** Passes through the focus event from the input field */
  onFocus?: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  /** Passes through the change event from the input field */
  onChange?: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  /** Passes through the blur event from the input field */
  onBlur?: (
    evt:
      | MouseEvent
      | SyntheticInputEvent<HTMLInputElement>
      | SyntheticKeyboardEvent<HTMLElement>,
  ) => void,
  /** Is called when a data entry was picked */
  onPick?: (itemData: Data) => void,
  /** Title for the dropdown header */
  title?: string | MessageDescriptor,
  /** @ignore Will be injected by `withOmniPicker` */
  choose: Choose,
  /** @ignore Will be injected by `withOmniPicker` */
  close?: (
    evt:
      | MouseEvent
      | SyntheticInputEvent<HTMLInputElement>
      | SyntheticKeyboardEvent<HTMLElement>,
  ) => void,
  /** @ignore Will be injected by `withOmniPicker` */
  filteredData: ListType<Data>,
  /** @ignore Will be injected by `withOmniPicker` */
  id: string,
  /** @ignore Will be injected by `withOmniPicker` */
  inputRef: ?HTMLElement,
  /** @ignore Will be injected by `withOmniPicker` */
  keyUsed: boolean,
  /** @ignore Will be injected by `withOmniPicker` */
  select: (idx: number) => void,
  /** @ignore Will be injected by `withOmniPicker` */
  selected: number,
};

class OmniPicker extends Component<Props> {
  elm: ?HTMLElement;

  static displayName = 'OmniPicker';

  static defaultProps = {
    appearance: { position: 'bottom' },
    emptyComponent: OmniPickerItemEmpty,
  };

  componentDidMount() {
    if (document.body) {
      document.body.addEventListener('click', this.handleOutsideClick, true);
    }
  }

  componentWillUnmount() {
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  handleOpen = () => {
    const { onOpen } = this.props;
    if (typeof onOpen == 'function') {
      onOpen();
    }
  };

  handleClose = () => {
    const { onClose } = this.props;
    if (typeof onClose == 'function') {
      onClose();
    }
  };

  handleReset = () => {
    const { onReset } = this.props;
    if (typeof onReset == 'function') {
      onReset();
    }
  };

  handleKeyUp = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    const { onKeyUp } = this.props;
    if (typeof onKeyUp == 'function') {
      onKeyUp(evt);
    }
  };

  handleKeyDown = (evt: SyntheticKeyboardEvent<HTMLElement>) => {
    const { onKeyDown } = this.props;
    if (typeof onKeyDown == 'function') {
      onKeyDown(evt);
    }
  };

  handleChange = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    if (typeof onChange == 'function') {
      onChange(evt);
    }
  };

  handleFocus = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;
    if (typeof onFocus == 'function') {
      onFocus(evt);
    }
  };

  handleBlur = (
    evt:
      | MouseEvent
      | SyntheticInputEvent<HTMLInputElement>
      | SyntheticKeyboardEvent<HTMLElement>,
  ) => {
    const { onBlur } = this.props;
    if (typeof onBlur == 'function') {
      onBlur(evt);
    }
  };

  handlePick = (itemData: Data) => {
    const { onPick } = this.props;
    if (typeof onPick == 'function') {
      onPick(itemData);
    }
  };

  handleOutsideClick = (evt: MouseEvent) => {
    const { inputRef, close } = this.props;
    if (
      (evt.target instanceof Node &&
        this.elm &&
        this.elm.contains(evt.target)) ||
      (evt.target instanceof Node && inputRef && inputRef.contains(evt.target))
    )
      return;
    if (typeof close == 'function') close(evt);
  };

  registerElement = (node: ?HTMLElement) => {
    this.elm = node;
  };

  renderHeader = () => {
    const {
      close,
      appearance: { position },
      title,
    } = this.props;
    return (
      <div
        className={cx(styles.header, styles[`header-${position}`], 'header')}
      >
        {title &&
          (typeof title == 'string' ? title : <FormattedMessage {...title} />)}
        <div className={styles.close}>
          <FormattedMessage {...MSG.close} />
          <button className={styles.closeButton} type="button" onClick={close}>
            &times;
          </button>
        </div>
      </div>
    );
  };

  render() {
    const {
      contentClassName,
      choose,
      appearance: { position },
      emptyComponent,
      filteredData,
      id,
      itemComponent,
      keyUsed,
      select,
      selected,
    } = this.props;
    return (
      <div className={styles.main} ref={this.registerElement}>
        {position === 'top' && this.renderHeader()}
        <OmniPickerContent
          className={contentClassName}
          onChoose={choose}
          id={id}
          onSelect={select}
          filteredData={filteredData}
          keyUsed={keyUsed}
          selected={selected}
          emptyComponent={emptyComponent}
          itemComponent={itemComponent}
        />
        {position === 'bottom' && this.renderHeader()}
      </div>
    );
  }
}

export default OmniPicker;

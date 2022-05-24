import { MessageDescriptor, FormattedMessage } from 'react-intl';
import React, {
  Component,
  KeyboardEvent,
  SyntheticEvent,
  MouseEvent,
} from 'react';
import cx from 'classnames';

import {
  Choose,
  OmniPickerData,
  EmptyRenderFnType,
  ItemRenderFnType,
} from './types';
import OmniPickerContent from './OmniPickerContent';
import OmniPickerItemEmpty from './OmniPickerItemEmpty';
import styles from './OmniPicker.css';

interface Appearance {
  position: 'top' | 'bottom';
}

export interface Props {
  /** Appearance object */
  appearance: Appearance;

  /** Render prop to use for the empty state */
  renderEmpty: EmptyRenderFnType;

  /** Render prop for rendering the item component */
  renderItem: ItemRenderFnType<any>;

  /**  Called after the picker was opened */
  onOpen?: () => void;

  /** Called after the picker was closed */
  onClose?: () => void;

  /** Called when the picker is being reset */
  onReset?: () => void;

  /** Passes through the keyUp event from the input field */
  onKeyUp?: (evt: KeyboardEvent<HTMLElement>) => void;

  /** Passes through the keyDown event from the input field */
  onKeyDown?: (evt: KeyboardEvent<HTMLElement>) => void;

  /** Passes through the focus event from the input field */
  onFocus?: (evt: SyntheticEvent<HTMLInputElement>) => void;

  /** Passes through the change event from the input field */
  onChange?: (evt: SyntheticEvent<HTMLInputElement>) => void;

  /** Passes through the blur event from the input field */
  onBlur?: (
    evt:
      | MouseEvent
      | SyntheticEvent<HTMLInputElement>
      | KeyboardEvent<HTMLElement>,
  ) => void;

  /** Is called when a data entry was picked */
  onPick?: (itemData: OmniPickerData) => void;

  /** Title for the dropdown header */
  title?: string | MessageDescriptor;

  /** @ignore Will be injected by `withOmniPicker` */
  choose: Choose;

  /** @ignore Will be injected by `withOmniPicker` */
  close?: (
    evt:
      | MouseEvent
      | SyntheticEvent<HTMLInputElement>
      | KeyboardEvent<HTMLElement>,
  ) => void;

  /** @ignore Will be injected by `withOmniPicker` */
  getItem: (data: OmniPickerData[], selectedIdx: number) => OmniPickerData;

  /** @ignore Will be injected by `withOmniPicker` */
  filteredData: OmniPickerData[];

  /** @ignore Will be injected by `withOmniPicker` */
  id: string;

  /** @ignore Will be injected by `withOmniPicker` */
  inputRef: HTMLElement | null;

  /** @ignore Will be injected by `withOmniPicker` */
  keyUsed: boolean;

  /** @ignore Will be injected by `withOmniPicker` */
  select: (idx: number) => void;

  /** @ignore Will be injected by `withOmniPicker` */
  selected: number;
}

class OmniPicker extends Component<Props> {
  elm?: HTMLElement | null;

  static displayName = 'OmniPicker';

  static defaultProps = {
    appearance: { position: 'bottom' },
    renderEmpty: () => <OmniPickerItemEmpty />,
  };

  componentDidMount() {
    if (document.body) {
      document.body.addEventListener(
        'click',
        this.handleOutsideClick as any,
        true,
      );
    }
  }

  componentWillUnmount() {
    if (document.body) {
      document.body.removeEventListener(
        'click',
        this.handleOutsideClick as any,
        true,
      );
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

  handleKeyUp = (evt: KeyboardEvent<HTMLElement>) => {
    const { onKeyUp } = this.props;
    if (typeof onKeyUp == 'function') {
      onKeyUp(evt);
    }
  };

  handleKeyDown = (evt: KeyboardEvent<HTMLElement>) => {
    const { onKeyDown } = this.props;
    if (typeof onKeyDown == 'function') {
      onKeyDown(evt);
    }
  };

  handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    if (typeof onChange == 'function') {
      onChange(evt);
    }
  };

  handleFocus = (evt: SyntheticEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;
    if (typeof onFocus == 'function') {
      onFocus(evt);
    }
  };

  handleBlur = (
    evt:
      | MouseEvent
      | SyntheticEvent<HTMLInputElement>
      | KeyboardEvent<HTMLElement>,
  ) => {
    const { inputRef, onBlur } = this.props;
    if (inputRef) {
      inputRef.blur();
    }
    if (typeof onBlur == 'function') {
      onBlur(evt);
    }
  };

  handlePick = (itemData: OmniPickerData) => {
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

  registerElement = (node: HTMLElement | null) => {
    this.elm = node;
  };

  renderHeader = () => {
    const {
      appearance: { position },
      title,
    } = this.props;
    return (
      title && (
        <div
          className={cx(styles.header, styles[`header-${position}`], 'header')}
        >
          {typeof title == 'string' ? title : <FormattedMessage {...title} />}
        </div>
      )
    );
  };

  render() {
    const {
      choose,
      appearance: { position },
      filteredData,
      id,
      renderEmpty,
      renderItem,
      keyUsed,
      select,
      selected,
    } = this.props;
    return (
      <div className={styles.main} ref={this.registerElement}>
        {position === 'top' && this.renderHeader()}
        <OmniPickerContent
          onChoose={choose}
          id={id}
          onSelect={select}
          filteredData={filteredData}
          keyUsed={keyUsed}
          selected={selected}
          renderEmpty={renderEmpty}
          renderItem={renderItem}
        />
        {position === 'bottom' && this.renderHeader()}
      </div>
    );
  }
}

export default OmniPicker;

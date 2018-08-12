/* @flow */

import type { ComponentType } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import styles from './OmniPickerDropdown.css';

import type { Choose, Data, ItemComponentType } from './types';

import OmniPickerContent from './OmniPickerContent.jsx';
import OmniPickerItemEmpty from './OmniPickerItemEmpty.jsx';

const MSG = defineMessages({
  close: {
    id: 'OmniPickerDropdown.close',
    defaultMessage: 'Esc to dismiss',
  },
  emptyMessage: {
    id: 'OmniPickerDropdown.emptyMessage',
    defaultMessage: 'Sorry, we could not find any match.',
  },
});

type Appearance = {
  position: 'top' | 'bottom',
};

type Props = {
  appearance: Appearance,
  contentClassName?: string,
  emptyComponent: ComponentType<{}>,
  filteredData: Array<Data>,
  id: string,
  inputRef: ?HTMLElement,
  itemComponent: ItemComponentType,
  keyUsed: boolean,
  onChoose: Choose,
  onClose?: () => void,
  onSelect: (idx: number) => void,
  selected: number,
  title?: string | MessageDescriptor,
};

class OmniPickerDropdown extends Component<Props> {
  elm: ?HTMLElement;

  static displayName = 'OmniPickerDropdown';

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

  handleOutsideClick = (evt: MouseEvent) => {
    const { inputRef, onClose } = this.props;
    if (
      (evt.target instanceof Node &&
        this.elm &&
        this.elm.contains(evt.target)) ||
      (evt.target instanceof Node && inputRef && inputRef.contains(evt.target))
    )
      return;
    if (typeof onClose == 'function') onClose();
  };

  registerElement = (node: ?HTMLElement) => {
    this.elm = node;
  };

  renderHeader = () => {
    const {
      onClose,
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
          <button
            className={styles.closeButton}
            type="button"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  render() {
    const {
      contentClassName,
      onChoose,
      appearance: { position },
      emptyComponent,
      filteredData,
      id,
      itemComponent,
      keyUsed,
      onSelect,
      selected,
    } = this.props;
    return (
      <div className={styles.main} ref={this.registerElement}>
        {position === 'top' && this.renderHeader()}
        <OmniPickerContent
          className={contentClassName}
          onChoose={onChoose}
          id={id}
          onSelect={onSelect}
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

export default OmniPickerDropdown;

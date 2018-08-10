/* @flow */

import type { ComponentType } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import cx from 'classnames';

import styles from './OmniPickerDropdown.css';

// eslint-disable-next-line max-len
import type { Data, ItemComponentType } from './types';

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
  data: any,
  emptyComponent: ComponentType<{}>,
  id: string,
  itemComponent: ItemComponentType,
  title?: string | MessageDescriptor,
  filter: (data: any, filterValue: string) => Array<Data>,
  filterValue: string,
  getItem: (data: Array<Data>, selectedIdx: number) => Data,
  onClose?: () => void,
  onReset?: () => void,
  onSelect: Data => void,
  // eslint-disable-next-line no-use-before-define
  withRef?: (omniPickerInstance: OmniPickerDropdown) => void,
  inputRef: ?HTMLElement,
};

type State = {
  selected: number,
  keyUsed: boolean,
};

class OmniPickerDropdown extends Component<Props, State> {
  elm: ?HTMLElement;

  static displayName = 'OmniPickerDropdown';

  static defaultProps = {
    appearance: { position: 'bottom' },
    emptyComponent: OmniPickerItemEmpty,
    getItem: (filteredData: Array<Data>, selectedIdx: number) =>
      filteredData[selectedIdx],
  };

  state = {
    selected: -1,
    keyUsed: false,
  };

  componentDidMount() {
    const { withRef } = this.props;
    if (document.body) {
      document.body.addEventListener('click', this.handleOutsideClick, true);
    }
    if (withRef) {
      withRef(this);
    }
  }

  componentWillUnmount() {
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  goUp = () => {
    const { selected } = this.state;
    this.setState({
      keyUsed: true,
      selected: selected === 0 ? 0 : selected - 1,
    });
  };

  goDown = () => {
    const { selected } = this.state;
    const { data, filter, filterValue, getItem } = this.props;
    const filteredData = filter(data, filterValue);
    const next = getItem(filteredData, selected + 1);
    if (next) {
      this.setState({
        keyUsed: true,
        selected: selected + 1,
      });
    }
  };

  choose = () => {
    const {
      data,
      getItem,
      onReset,
      onSelect,
      filter,
      filterValue,
    } = this.props;
    const { selected } = this.state;
    const filteredData = filter(data, filterValue);
    if (selected < 0) return;
    const itemData = getItem(filteredData, selected);
    onSelect(itemData);
    if (typeof onReset == 'function') onReset();
  };

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

  select = (idx: number) => {
    this.setState({
      keyUsed: false,
      selected: idx,
    });
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
      appearance: { position },
      id,
      itemComponent,
      emptyComponent,
      data,
      filter,
      filterValue,
    } = this.props;
    const { keyUsed, selected } = this.state;
    const filteredData = filter(data, filterValue);
    return (
      <div className={styles.main} ref={this.registerElement}>
        {position === 'top' && this.renderHeader()}
        <OmniPickerContent
          className={contentClassName}
          choose={this.choose}
          id={id}
          select={this.select}
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

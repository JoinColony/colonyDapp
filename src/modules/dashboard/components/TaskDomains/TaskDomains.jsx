/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

import Heading from '~core/Heading';
import Button from '~core/Button';
import Popover from '~core/Popover';

import styles from './TaskDomains.css';

import { domainMocks } from './__datamocks__/mockDomains';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domain',
  },
  selectDomain: {
    id: 'dashboard.TaskDomains.selectDomain',
    defaultMessage: `{domainSelected, select,
      undefined {Add +}
      other {Modify}
    }`,
  },
});

type ConsumableDomain = {
  id: number,
  name: string,
};

type Props = {};

type State = {
  /*
   * This values determines if any domain in the (newly opened) list was selected
   */
  listTouched: boolean,
  /*
   * Domain selected in the popover list
   */
  selectedDomain: number | void,
  /*
   * Domain that is actually set on the task
   */
  setDomain: number | void,
};

class TaskDomains extends Component<Props, State> {
  static displayName = 'dashboard.TaskDomains';

  state = {
    listTouched: false,
    selectedDomain: undefined,
    setDomain: undefined,
  };

  componentWillMount() {
    /*
     * This should be fetch from somewhere like the DDB
     */
    this.allDomains = domainMocks;
  }

  /*
   * Handle clicking on each individual domain in the list
   */

  handleSelectDomain = this.handleSelectDomain.bind(this);

  handleSelectDomain(id: number) {
    this.setState({ selectedDomain: id, listTouched: true });
  }

  /*
   * Handle cleanup when closing the popover (or pressing cancel)
   *
   * If a domain was selected, but not set (didn't submit the form) then we
   * need to re-set it back to the original set domain.
   *
   * Otherwise the next time it will open it will show the selected one, and not
   * the actual set one.
   */

  handleCleanup = this.handleCleanup.bind(this);

  handleCleanup(callback: () => void) {
    const { setDomain } = this.state || undefined;
    this.setState({ selectedDomain: setDomain, listTouched: false }, callback);
  }

  /*
   * Set the domain when clicking the confirm button
   *
   * This will most likely call an action creator at some point
   */

  handleSetDomain = this.handleSetDomain.bind(this);

  handleSetDomain(callback: () => void) {
    const {
      state: { selectedDomain },
      allDomains,
    } = this;
    this.setState(
      {
        setDomain: selectedDomain,
        selectedDomain: undefined,
        listTouched: false,
      },
      callback,
    );
    /*
     * @NOTE Here we should be caling the action creator
     * Maybe even before changing the state
     */
    const newlySetDomain: ConsumableDomain | void = allDomains.find(
      ({ id }) => id === selectedDomain,
    );
    console.log(TaskDomains.displayName, newlySetDomain);
  }

  /*
   * Helper to render an entry in the domains list
   */

  renderDomainListItem = this.renderDomainListItem.bind(this);

  renderDomainListItem({ id, name }: ConsumableDomain) {
    const { selectedDomain } = this.state;
    return (
      <li
        className={selectedDomain === id ? styles.selectedDomain : null}
        key={nanoid(id)}
      >
        <button
          type="button"
          className={styles.domainItem}
          onClick={() => this.handleSelectDomain(id)}
        >
          {`#${name}`}
        </button>
      </li>
    );
  }

  /*
   * @TODO Most likely this is temporary, and the way we'll fetch the *real* data
   * won't require having this here
   */
  allDomains: Array<ConsumableDomain> = [];

  render() {
    const {
      state: { setDomain: setDomainId, listTouched },
      allDomains,
    } = this;
    const currentDomain: ConsumableDomain | void = allDomains.find(
      ({ id }) => id === setDomainId,
    );
    return (
      <div className={styles.main}>
        <div className={styles.controls}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.title}
          />
          <Popover
            trigger="click"
            placement="bottom"
            onClose={this.handleCleanup}
            content={({ close }) => (
              <div className={styles.domainsWrapper}>
                <ul className={styles.domainList}>
                  {allDomains.map((domain: ConsumableDomain) =>
                    this.renderDomainListItem(domain),
                  )}
                </ul>
                <div className={styles.domainControls}>
                  <Button
                    appearance={{ theme: 'secondary' }}
                    text={{ id: 'button.cancel' }}
                    onClick={() => this.handleCleanup(close)}
                  />
                  <Button
                    appearance={{ theme: 'primary' }}
                    text={{ id: 'button.confirm' }}
                    disabled={!listTouched}
                    onClick={() => this.handleSetDomain(close)}
                  />
                </div>
              </div>
            )}
          >
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.selectDomain}
              textValues={{ domainSelected: setDomainId }}
            />
          </Popover>
        </div>
        <div className={styles.currentDomain}>
          {currentDomain && `#${currentDomain.name}`}
        </div>
      </div>
    );
  }
}

export default TaskDomains;

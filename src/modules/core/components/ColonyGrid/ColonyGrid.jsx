/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '../Heading';
import { SpinnerLoader } from '../Preloaders';

import ColonyGridItem from './ColonyGridItem.jsx';

import styles from './ColonyGrid.css';

const MSG = defineMessages({
  title: {
    id: 'ColonyGrid.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {
  /** Array of colonies to display */
  colonies: Array<{
    displayName: string,
    colonyAddress: string,
  }>,
};

type State = {
  isLoading: boolean,
};

class ColonyGrid extends Component<Props, State> {
  timeout: TimeoutID;

  static displayName = 'ColonyGrid';

  static defaultProps = {
    colonies: [],
  };

  state = { isLoading: false };

  componentDidMount() {
    this.getColonyGrid();
  }

  getColonyGrid = () => {
    this.setState({ isLoading: true });
    this.timeout = setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 1000);
  };

  render() {
    const { colonies } = this.props;
    const { isLoading } = this.state;

    return (
      <div className={styles.main}>
        <div className={styles.sectionTitle}>
          <Heading text={MSG.title} appearance={{ size: 'medium' }} />
        </div>
        {isLoading ? (
          <div className={styles.loader}>
            <SpinnerLoader appearance={{ size: 'large' }} />
          </div>
        ) : (
          <div className={styles.colonyGrid}>
            {colonies.map(colony => (
              <div className={styles.colonyGridItem} key={colony.colonyAddress}>
                <ColonyGridItem colony={colony} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ColonyGrid;

/* @flow */
import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '../../../core/components/Heading';
import { SpinnerLoader } from '../../../core/components/Preloaders';

import UserColonyItem from '../UserColonyItem';

import styles from './UserColonies.css';

import MockColonies from './__mocks__/MockColonies';

const MSG = defineMessages({
  title: {
    id: 'users.UserProfile.UserColonies.title',
    defaultMessage: 'Colonies',
  },
});

type Props = {
  // user: Object,
};

type State = {
  colonies: Array<Object>,
  isLoading: boolean,
};

class UserColonies extends Component<Props, State> {
  timeout: TimeoutID;

  displayName = 'UserColonies';

  state = { colonies: [], isLoading: false };

  componentDidMount() {
    this.getUserColonies();
  }

  getUserColonies = () => {
    this.setState({ isLoading: true });
    this.timeout = setTimeout(() => {
      this.setState({
        isLoading: false,
        colonies: MockColonies,
      });
    }, 1000);
  };

  render() {
    const { colonies, isLoading } = this.state;

    return (
      <div className={styles.main}>
        {isLoading ? (
          <SpinnerLoader appearance={{ size: 'large' }} />
        ) : (
          <Fragment>
            <Heading text={MSG.title} appearance={{ size: 'medium' }} />
            <div className={styles.colonyGrid}>
              {colonies.map(colony => (
                <UserColonyItem colony={colony} />
              ))}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default UserColonies;

/* @flow */

import type { MessageDescriptor } from 'react-intl';

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Radio } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';

import styles from './StarRatingRadio.css';

const MSG = defineMessages({
  ratingStar: {
    id: 'dashboard.TaskRatingDialog.ratingStar',
    defaultMessage: 'Rating Star',
  },
});

const getUnselectedProps = (isUnselected: boolean) => {
  if (isUnselected) {
    return {
      className: styles.ratingStarUnselected,
    };
  }
  return {
    appearance: { size: 'tiny', theme: 'primary' },
  };
};

type Props = {
  name: string,
  /*
   * @NOTE the value, will also control the way the stars are highlighted
   * and the warning text displayed
   *
   */
  value: 1 | 2 | 3,
  checked: boolean,
  title: MessageDescriptor,
  description: MessageDescriptor,
};

const displayName = 'dashboard.TaskRatingDialog.StarRatingRadio';

const StarRatingRadio = ({
  title,
  description,
  value = 3,
  name,
  checked = false,
}: Props) => (
  <Radio checked={checked} name={name} value={value}>
    <div className={styles.ratingItem}>
      <div className={styles.ratingText}>
        <Heading appearance={{ size: 'normal', margin: 'none' }} text={title} />
        <p
          className={
            value === 1
              ? styles.ratingItemWarning
              : styles.ratingItemDescription
          }
        >
          <FormattedMessage {...description} />
        </p>
      </div>
      <div className={styles.ratingStars}>
        <Icon
          name="star"
          title={MSG.ratingStar}
          appearance={{ size: 'tiny', theme: 'primary' }}
        />
        <Icon
          name="star"
          title={MSG.ratingStar}
          {...getUnselectedProps(value === 1)}
        />
        <Icon
          name="star"
          title={MSG.ratingStar}
          {...getUnselectedProps(value === 1 || value === 2)}
        />
      </div>
    </div>
  </Radio>
);

StarRatingRadio.displayName = displayName;

export default StarRatingRadio;

import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import { ComplexMessageValues } from '~types/index';

import { getMainClasses } from '~utils/css';
import styles from './CalloutCard.css';

const displayName = 'CalloutCard';

interface Appearance {
  theme?: 'primary' | 'info' | 'danger' | 'pinky';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** label text */
  label: MessageDescriptor;

  /** Values for context text (react-intl interpolation) */
  labelValues?: ComplexMessageValues;

  /** A string or a `messageDescriptor` that make up the cards's content */
  description: MessageDescriptor;

  /** Values for context text (react-intl interpolation) */
  descriptionValues?: ComplexMessageValues;
}

const CalloutCard = ({
  appearance = { theme: 'pinky' },
  label,
  labelValues,
  description,
  descriptionValues,
}: Props) => {
  return (
    <div className={getMainClasses(appearance, styles)}>
      <FormattedMessage {...label} values={labelValues} />
      <FormattedMessage {...description} values={descriptionValues} />
    </div>
  );
};

CalloutCard.displayName = displayName;

export default CalloutCard;

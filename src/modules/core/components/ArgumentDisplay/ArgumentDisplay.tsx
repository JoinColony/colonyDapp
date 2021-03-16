import React from 'react';

import HookedUserAvatar from '~users/HookedUserAvatar';
import TimeRelative from '~core/TimeRelative';
import Tag from '~core/Tag';
import { useUser } from '~data/index';
import { getMainClasses } from '~utils/css';

import styles from './ArgumentDisplay.css';

interface Appearance {
  theme?: 'motion' | 'objection';
}

interface Argument {
  author: string;
  comment: string;
  timestamp: number;
}

interface Props {
  appearance?: Appearance;
  argument: Argument;
}

const displayName = 'ArgumentDisplay';

const ArgumentDisplay = ({
  appearance = { theme: 'motion' },
  argument: { author, timestamp, comment },
}: Props) => {
  const user = useUser(author);
  const tagTheme = appearance.theme === 'motion' ? 'primary' : 'pink';
  const tagText = appearance.theme === 'motion' ? 'Motion' : 'Objection';
  const UserAvatar = HookedUserAvatar({ fetchUser: false });

  return (
    <div
      className={`${styles.container} ${getMainClasses(appearance, styles)}`}
    >
      <div className={styles.avatar}>
        <UserAvatar address={author} user={user} size="xs" notSet={false} />
      </div>
      <div className={styles.main}>
        <div>
          <Tag
            text={tagText}
            appearance={{
              theme: tagTheme,
              colorSchema: 'fullColor',
              fontSize: 'small',
            }}
          />
          <TimeRelative
            className={styles.timestamp}
            value={new Date(timestamp)}
          />
        </div>
        <p className={styles.message}>{comment}</p>
      </div>
    </div>
  );
};

ArgumentDisplay.displayName = displayName;

export default ArgumentDisplay;

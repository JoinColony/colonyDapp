/* @flow */
import React from 'react';

import Popover from '../../../core/components/Popover';
import UserAvatar from '../../../core/components/UserAvatar';

const AvatarDropdown = () => (
  <Popover
    trigger="click"
    content={() => (
      <div>
        <p>Some content</p>
      </div>
    )}
  >
    <UserAvatar username="Something Special" />
  </Popover>
);

export default AvatarDropdown;

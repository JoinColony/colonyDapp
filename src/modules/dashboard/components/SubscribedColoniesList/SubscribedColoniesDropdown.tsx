import React from 'react';
import { NavLink } from 'react-router-dom';
import ColonyAvatar from '~core/ColonyAvatar';
import DropdownMenu, {
  DropdownMenuSection,
  DropdownMenuItem,
} from '~core/DropdownMenu';
import Popover from '~core/Popover';
import { ProcessedColony } from '~data/generated';
import styles from './SubscribedColoniesList.css';

const displayName =
  'dashboard.SubscribedColoniesList.SubscribedColoniesDropdown';

export type Colony = Pick<
  ProcessedColony,
  | 'colonyName'
  | 'colonyAddress'
  | 'id'
  | 'displayName'
  | 'avatarHash'
  | 'avatarURL'
>;
interface Props {
  activeColony?: Colony;
  coloniesList: Colony[];
}

const SubscribedColoniesDropdown = ({ activeColony, coloniesList }: Props) => {
  const colonyToDisplay = activeColony || coloniesList[0];
  return (
    <Popover
      content={() => {
        return (
          <DropdownMenu>
            <DropdownMenuSection>
              {coloniesList.map((colony) => (
                <DropdownMenuItem key={colony.colonyAddress}>
                  <NavLink
                    activeClassName={styles.activeColony}
                    title={colony.colonyName}
                    to={`/colony/${colony.colonyName}`}
                  >
                    <div className={styles.dropdownItem}>
                      <div className={styles.itemImage}>
                        <ColonyAvatar
                          colony={colony}
                          colonyAddress={colony.colonyAddress}
                          size="xs"
                        />
                      </div>
                      <div>{colony.displayName}</div>
                    </div>
                  </NavLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSection>
          </DropdownMenu>
        );
      }}
      trigger="click"
      showArrow={false}
      placement="bottom"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 5],
            },
          },
        ],
      }}
    >
      <NavLink
        activeClassName={styles.activeColony}
        className={styles.itemLink}
        title={colonyToDisplay.colonyName}
        to={`/colony/${colonyToDisplay.colonyName}`}
      >
        <div className={styles.itemImage}>
          <ColonyAvatar
            colony={colonyToDisplay}
            colonyAddress={colonyToDisplay.colonyAddress}
            size="xs"
          />
        </div>
      </NavLink>
    </Popover>
  );
};

SubscribedColoniesDropdown.displayName = displayName;

export default SubscribedColoniesDropdown;

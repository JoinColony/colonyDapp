import React, { useMemo } from 'react';
import {
  FormattedDateParts,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'react-intl';

import { bottom } from '@popperjs/core';
import HookedUserAvatar from '~users/HookedUserAvatar';
import { AbbreviatedNumeral } from '~core/Numeral';
import Icon from '~core/Icon';
import UserMention from '~core/UserMention';
import InfoPopover from '~core/InfoPopover';

import TextDecorator from '~lib/TextDecorator';
import { getMainClasses, removeValueUnits } from '~utils/css';

import styles, { popoverWidth, popoverDistance } from './ActionsListItem.css';

const displayName = 'ActionsList.ActionsListItem';

const UserAvatar = HookedUserAvatar();

const MSG = defineMessages({
  domain: {
    id: 'ActionsList.ActionsListItem.domain',
    defaultMessage: 'Domain {domainId}',
  },
  titleCommentCount: {
    id: 'ActionsList.ActionsListItem.titleCommentCount',
    defaultMessage: `{formattedCommentCount} {commentCount, plural,
      one {comment}
      other {comments}
    }`,
  },
});

export enum Status {
  'needsAction' = 'red',
  'needsAttention' = 'blue',
}

interface Props {
  /*
   * @TODO This should be a type of Events, Actions or Logs
   *
   * Item shoud be:
   * id: string,
   * userAddress: string,
   * user?: AnyUser
   * title?: string | messageDescriptor,
   * topic?: string
   * date: Date,
   * domain?: DomainType,
   * commentCount?: number,
   * status?: number
   */
  item: any;
  handleOnClick?: () => void;
}

const ActionsListItem = ({ item: { userAddress, status }, item }: Props) => {
  const { formatMessage, formatNumber } = useIntl();

  const popoverPlacement = useMemo(() => {
    const offsetSkid = (-1 * removeValueUnits(popoverWidth)) / 2;
    return [offsetSkid, removeValueUnits(popoverDistance)];
  }, []);

  const { Decorate } = new TextDecorator({
    username: (text) => (
      <InfoPopover
        trigger="click"
        showArrow={false}
        /*
         * @TODO Prefferably pass in the actual user object here, rather then just
         * the wallet address
         */
        user={{ id: userAddress, profile: { walletAddress: userAddress } }}
        popperProps={{
          placement: 'bottom',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: popoverPlacement,
              },
            },
          ],
        }}
      >
        <div className={styles.userMention}>
          <UserMention username={text.slice(1)} />
        </div>
      </InfoPopover>
    ),
  });

  return (
    <li className={getMainClasses({}, styles, { [Status[status]]: !!status })}>
      <div className={styles.avatar}>
        {userAddress && (
          <UserAvatar
            size="s"
            address={userAddress}
            notSet={false}
            showInfo
            popperProps={{
              showArrow: false,
              placement: bottom,
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: popoverPlacement,
                  },
                },
              ],
              /*
               * @NOTE This is the price we have to pay for the ability
               * to customize the Popor library, which is nested under the
               * Popover component, which is nested under UserInfo,
               * which is nested under UserAvatar
               */
              children: () => null,
            }}
          />
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.title} title={item.title}>
          <Decorate>{item.title}</Decorate>
        </div>
        <div className={styles.meta}>
          <FormattedDateParts value={item.date} month="short" day="numeric">
            {(parts) => (
              <>
                <span className={styles.day}>{parts[2].value}</span>
                <span>{parts[0].value}</span>
              </>
            )}
          </FormattedDateParts>
          {item.domain && item.domain.id && (
            <span className={styles.domain}>
              {item.domain.name ? (
                item.domain.name
              ) : (
                <FormattedMessage
                  {...MSG.domain}
                  values={{ domainId: item.domain.id }}
                />
              )}
            </span>
          )}
          {!!item.commentCount && (
            <span className={styles.commentCount}>
              <Icon
                appearance={{ size: 'extraTiny' }}
                className={styles.commentCountIcon}
                name="comment"
                title={formatMessage(MSG.titleCommentCount, {
                  commentCount: item.commentCount,
                  formattedCommentCount: formatNumber(item.commentCount),
                })}
              />
              <AbbreviatedNumeral
                formatOptions={{
                  notation: 'compact',
                }}
                value={item.commentCount}
                title={formatMessage(MSG.titleCommentCount, {
                  commentCount: item.commentCount,
                  formattedCommentCount: formatNumber(item.commentCount),
                })}
              />
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;

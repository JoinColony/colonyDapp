import React, { useMemo, useCallback } from 'react';
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

import TextDecorator from '~lib/TextDecorator';
import { getMainClasses, removeValueUnits } from '~utils/css';
import { ClickHandlerProps } from './ActionsList';

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
  /*
   * @NOTE To be used when the action or event that's passed in, doesn't have
   * a title value.
   * This should not happen in the wild
   */
  genericActionTitle: {
    id: 'ActionsList.ActionsListItem.genericActionTitle',
    defaultMessage: `Generic Action`,
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
   * Item shoud be something aling these lines:
   *
   * id: string,
   * userAddress: string,
   * user?: AnyUser
   * title?: string | messageDescriptor,
   * topic?: string
   * createdAt: Date,
   * domain?: DomainType,
   * commentCount?: number,
   * status?: number
   */
  item: any;
  handleOnClick?: (handlerProps: ClickHandlerProps) => void;
}

const ActionsListItem = ({
  item: { id, userAddress, status, topic, domainId },
  item,
  handleOnClick,
}: Props) => {
  const { formatMessage, formatNumber } = useIntl();

  const popoverPlacement = useMemo(() => {
    const offsetSkid = (-1 * removeValueUnits(popoverWidth)) / 2;
    return [offsetSkid, removeValueUnits(popoverDistance)];
  }, []);

  const handleSyntheticEvent = useCallback(
    () => handleOnClick && handleOnClick({ id, userAddress, topic, domainId }),
    [handleOnClick, id, userAddress, topic, domainId],
  );

  const { Decorate } = new TextDecorator({
    username: (usernameWithAtSign) => (
      <UserMention
        username={usernameWithAtSign.slice(1)}
        showInfo
        popperProps={{
          showArrow: false,
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
      />
    ),
  });

  return (
    <li>
      <div
        /*
         * @NOTE This is non-interactive element to appease the DOM Nesting Validator
         *
         * We're using a lot of nested components here, which themselves render interactive
         * elements.
         * So if this were say... a button, it would try to render a button under a button
         * and the validator would just yell at us some more.
         *
         * The other way to solve this, would be to make this list a table, and have the
         * click handler on the table row.
         * That isn't a option for us since I couldn't make the text ellipsis
         * behave nicely (ie: work) while using our core <Table /> components
         */
        role="button"
        tabIndex={0}
        className={getMainClasses({}, styles, {
          noPointer: !handleOnClick,
          [Status[status]]: !!status,
        })}
        onClick={handleSyntheticEvent}
        onKeyPress={handleSyntheticEvent}
      >
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
              }}
            />
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title} title={item.title}>
            {item.title ? (
              <Decorate>{item.title}</Decorate>
            ) : (
              <FormattedMessage {...MSG.genericActionTitle} />
            )}
          </div>
          <div className={styles.meta}>
            <FormattedDateParts
              value={item.createdAt}
              month="short"
              day="numeric"
            >
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
      </div>
    </li>
  );
};

ActionsListItem.displayName = displayName;

export default ActionsListItem;

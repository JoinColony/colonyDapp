import React, { useMemo, useCallback } from 'react';
import {
  FormattedDateParts,
  FormattedMessage,
  defineMessages,
  useIntl,
} from 'react-intl';

import HookedUserAvatar from '~users/HookedUserAvatar';
import Numeral, { AbbreviatedNumeral } from '~core/Numeral';
import Icon from '~core/Icon';
import FriendlyName from '~core/FriendlyName';

import { getMainClasses, removeValueUnits } from '~utils/css';
import { getTokenDecimalsWithFallback } from '~utils/tokens';
import { useUser, Colony } from '~data/index';
import { createAddress } from '~utils/web3';
import { FormattedAction } from '~types/index';

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
});

export enum Status {
  'needsAction' = 'red',
  'needsAttention' = 'blue',
}

interface Props {
  item: FormattedAction;
  colony: Colony;
  handleOnClick?: (handlerProps: ClickHandlerProps) => void;
}

const ActionsListItem = ({
  item: {
    id,
    actionType,
    initiator,
    recipient,
    amount,
    symbol,
    decimals,
    fromDomain: fromDomainId,
    toDomain: toDomainId,
    transactionHash,
    createdAt,
    commentCount = 0,
  },
  colony,
  handleOnClick,
}: Props) => {
  const { formatMessage, formatNumber } = useIntl();

  /*
   * @TODO createAddress is just temporary
   * Address checksum / normalization needs to be fixed on the
   * subgraph side
   */
  const initiatorUserProfile = useUser(createAddress(initiator));
  const recipientUserProfile = useUser(createAddress(recipient));

  const fromDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === parseInt(fromDomainId, 10),
  );
  const toDomain = colony.domains.find(
    ({ ethDomainId }) => ethDomainId === parseInt(toDomainId, 10),
  );

  const popoverPlacement = useMemo(() => {
    const offsetSkid = (-1 * removeValueUnits(popoverWidth)) / 2;
    return [offsetSkid, removeValueUnits(popoverDistance)];
  }, []);

  const handleSyntheticEvent = useCallback(
    () => handleOnClick && handleOnClick({ id, transactionHash }),
    [handleOnClick, id, transactionHash],
  );

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
        })}
        onClick={handleSyntheticEvent}
        onKeyPress={handleSyntheticEvent}
      >
        <div className={styles.avatar}>
          {initiator && (
            <UserAvatar
              size="s"
              address={initiator}
              user={initiatorUserProfile}
              notSet={false}
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
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <FormattedMessage
              id="action.title"
              values={{
                actionType,
                initiator: (
                  <span className={styles.titleDecoration}>
                    <FriendlyName
                      user={initiatorUserProfile}
                      autoShrinkAddress
                    />
                  </span>
                ),
                /*
                 * @TODO Add user mention popover back in
                 */
                recipient: (
                  <span className={styles.titleDecoration}>
                    <FriendlyName
                      user={recipientUserProfile}
                      autoShrinkAddress
                    />
                  </span>
                ),
                amount: (
                  <Numeral
                    value={amount}
                    unit={getTokenDecimalsWithFallback(decimals)}
                  />
                ),
                tokenSymbol: symbol,
                decimals: getTokenDecimalsWithFallback(decimals),
                fromDomain: fromDomain?.name || '',
                toDomain: toDomain?.name || '',
              }}
            />
          </div>
          <div className={styles.meta}>
            <FormattedDateParts value={createdAt} month="short" day="numeric">
              {(parts) => (
                <>
                  <span className={styles.day}>{parts[2].value}</span>
                  <span>{parts[0].value}</span>
                </>
              )}
            </FormattedDateParts>
            {fromDomain && (
              <span className={styles.domain}>
                {fromDomain.name ? (
                  fromDomain.name
                ) : (
                  <FormattedMessage
                    {...MSG.domain}
                    values={{ domainId: fromDomain.id }}
                  />
                )}
              </span>
            )}
            {!!commentCount && (
              <span className={styles.commentCount}>
                <Icon
                  appearance={{ size: 'extraTiny' }}
                  className={styles.commentCountIcon}
                  name="comment"
                  title={formatMessage(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: formatNumber(commentCount),
                  })}
                />
                <AbbreviatedNumeral
                  formatOptions={{
                    notation: 'compact',
                  }}
                  value={commentCount}
                  title={formatMessage(MSG.titleCommentCount, {
                    commentCount,
                    formattedCommentCount: formatNumber(commentCount),
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

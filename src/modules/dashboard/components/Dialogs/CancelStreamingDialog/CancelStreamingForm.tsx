import React from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import { Colony, useLoggedInUser } from '~data/index';
import Dialog, { DialogSection } from '~core/Dialog';
import { Annotations, InputLabel, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';

import { FormValues } from './CancelStreamingDialog';
import FundingSourceItem from './FundingSourceItem';
import styles from './CancelStreamingDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.header',
    defaultMessage: 'Cancel treaming Payment',
  },
  description: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.description',
    defaultMessage: `You are cancelling the Streaming Payment. You will need to get collective approval first. To do so create a Motion. Any unclaimed funds can still be claimed by the recipient.`,
  },
  detailsTitle: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.detailsTitle',
    defaultMessage: 'Streaming Details',
  },
  to: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.to`,
    defaultMessage: 'To',
  },
  starts: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.starts`,
    defaultMessage: 'Starts',
  },
  startsValue: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.startsValue`,
    defaultMessage: '21 July 2021, 11:30am UTC',
  },
  ends: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.ends`,
    defaultMessage: 'Ends',
  },
  endsValue: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.endsValue`,
    defaultMessage: 'When cancelled',
  },
  submit: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.submit',
    defaultMessage: 'Submit',
  },
  textareaLabel: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.textareaLabel`,
    defaultMessage: `Explain why you're cancelling this payment (optional)`,
  },
});

const displayName = 'dashboard.CancelStreamingDialog.CancelStreamingForm';

interface Props {
  close: () => void;
  colony: Colony;
  onCancelStreaming: (isForce: boolean) => void;
  isVotingExtensionEnabled: boolean;
}

const fundingSourcesMock = [
  {
    rateToken: {
      address: '0x0000000000000000000000000000000000000000',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 18,
      iconHash: '',
      id: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
    },
    rateAmount: 10,
    rateTime: 'day',
    filteredDomainId: ROOT_DOMAIN_ID,
    id: '1',
  },
  {
    rateToken: {
      address: '0x0000000000000000000000000000000000000000',
      balances: [{ amount: '0', domainId: 0 }],
      decimals: 18,
      iconHash: '',
      id: '0x0000000000000000000000000000000000000000',
      name: 'Ether',
      symbol: 'ETH',
    },
    rateAmount: 1000,
    rateTime: 'month',
    filteredDomainId: ROOT_DOMAIN_ID,
    id: '2',
  },
];

const CancelStreamingForm = ({
  close,
  colony,
  onCancelStreaming,
  isVotingExtensionEnabled,
  values,
  isSubmitting,
  handleSubmit,
}: Props & FormikProps<FormValues>) => {
  const { walletAddress, username, ethereal } = useLoggedInUser();
  const allUserRoles = useTransformer(getAllUserRoles, [colony, walletAddress]);

  const hasRegisteredProfile = !!username && !ethereal;
  const canCancelStreaming = hasRegisteredProfile && hasRoot(allUserRoles);

  const [userHasPermission] = useDialogActionPermissions(
    colony.colonyAddress,
    canCancelStreaming,
    isVotingExtensionEnabled,
    values.forceAction,
  );

  return (
    <Dialog cancel={close}>
      <DialogSection>
        <div
          className={classNames(
            styles.row,
            styles.withoutPadding,
            styles.forceRow,
          )}
        >
          {colony && <MotionDomainSelect colony={colony} />}
          {canCancelStreaming && isVotingExtensionEnabled && (
            <div className={styles.toggleContainer}>
              <Toggle
                label={{ id: 'label.force' }}
                name="forceAction"
                appearance={{ theme: 'danger' }}
                disabled={!userHasPermission || isSubmitting}
                tooltipText={{ id: 'tooltip.forceAction' }}
                tooltipPopperOptions={{
                  placement: 'top-end',
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [-5, 6],
                      },
                    },
                  ],
                  strategy: 'fixed',
                }}
              />
            </div>
          )}
        </div>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.header} />
        </Heading>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <p className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </p>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <h4 className={styles.dialogSectionTitle}>
          <FormattedMessage {...MSG.detailsTitle} />
        </h4>
        <div
          className={classNames(
            styles.row,
            styles.rowAlt,
            styles.userContainer,
          )}
        >
          <InputLabel
            label={MSG.to}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={styles.userAvatarContainer}>
            <UserAvatar address={walletAddress} size="xs" notSet={false} />
            <div className={styles.userName}>
              <UserMention username={username || ''} />
            </div>
          </div>
        </div>
        <div
          className={classNames(
            styles.row,
            styles.rowAlt,
            styles.userContainer,
          )}
        >
          <InputLabel
            label={MSG.starts}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.value}>
            <FormattedMessage {...MSG.startsValue} />
          </span>
        </div>
        <div
          className={classNames(
            styles.row,
            styles.rowAlt,
            styles.userContainer,
          )}
        >
          <InputLabel
            label={MSG.ends}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.value}>
            <FormattedMessage {...MSG.endsValue} />
          </span>
        </div>
      </DialogSection>
      {fundingSourcesMock && (
        <ul>
          {fundingSourcesMock.map(({ filteredDomainId, ...props }, index) => (
            <li key={props.id}>
              <DialogSection appearance={{ theme: 'sidePadding' }}>
                <FundingSourceItem
                  {...props}
                  {...{ colony, index }}
                  filteredDomainId={filteredDomainId?.toString()}
                  isMultiple={fundingSourcesMock.length > 1}
                />
              </DialogSection>
            </li>
          ))}
        </ul>
      )}
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotations}>
          <Annotations
            label={MSG.textareaLabel}
            name="annotation"
            maxLength={90}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{
            theme: 'primary',
            size: 'large',
          }}
          style={{
            width: styles.buttonWidth,
          }}
          autoFocus
          text={{ id: 'button.submit' }}
          type="submit"
          onClick={() => {
            onCancelStreaming(values.forceAction);
            close();
            handleSubmit();
          }}
        />
      </DialogSection>
    </Dialog>
  );
};

CancelStreamingForm.displayName = displayName;

export default CancelStreamingForm;

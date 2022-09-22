import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { defineMessages, FormattedMessage } from 'react-intl';
import { FormikProps } from 'formik';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Dialog, { DialogSection } from '~core/Dialog';
import { Annotations, InputLabel, Toggle } from '~core/Fields';
import { Colony, useLoggedInUser } from '~data/index';
import Heading from '~core/Heading';
import Button from '~core/Button';
import UserAvatar from '~core/UserAvatar';
import UserMention from '~core/UserMention';
import ColorTag, { Color } from '~core/ColorTag';
import { useTransformer } from '~utils/hooks';
import { getAllUserRoles } from '~modules/transformers';
import { hasRoot } from '~modules/users/checks';
import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { ValuesType } from '~pages/ExpenditurePage/types';

import { FormValues } from './CancelStreamingDialog';
import styles from './CancelStreamingDialog.css';

const MSG = defineMessages({
  header: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.header',
    defaultMessage: 'Cancel streaming payment',
  },
  description: {
    id: 'dashboard.CancelStreamingDialog.CancelStreamingForm.description',
    defaultMessage:
      // eslint-disable-next-line max-len
      'You are cancelling the Streaming Payment. You will need to get collective approval first. To do so create a Motion. Any unclaimed funds can still be claimed by the recipient.',
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
  fundingSource: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.fundingSource`,
    defaultMessage: 'Funding Source',
  },
  team: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.team`,
    defaultMessage: 'Team',
  },
  rate: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.rate`,
    defaultMessage: 'Rate',
  },
  limit: {
    id: `dashboard.CancelStreamingDialog.CancelStreamingForm.limit`,
    defaultMessage: 'Limit',
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
  form: ValuesType;
}

const CancelStreamingForm = ({
  close,
  colony,
  onCancelStreaming,
  isVotingExtensionEnabled,
  values,
  isSubmitting,
  handleSubmit,
  form,
}: Props & FormikProps<FormValues>) => {
  const { filteredDomainId } = form || {};
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

  const domain = useMemo(
    () =>
      colony?.domains.find(
        ({ ethDomainId }) => Number(filteredDomainId) === ethDomainId,
      ),
    [colony, filteredDomainId],
  );

  const getDomainColor = useCallback<(domainId: string | undefined) => Color>(
    (domainId) => {
      const rootDomainColor: Color = Color.LightPink;
      const defaultColor: Color = Color.Yellow;
      if (domainId === String(ROOT_DOMAIN_ID)) {
        return rootDomainColor;
      }
      if (!colony || !domainId) {
        return defaultColor;
      }
      return domain ? domain.color : defaultColor;
    },
    [colony, domain],
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
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <h4 className={styles.dialogSectionTitle}>
          <FormattedMessage {...MSG.fundingSource} />
        </h4>
        <div
          className={classNames(
            styles.row,
            styles.rowAlt,
            styles.userContainer,
          )}
        >
          <InputLabel
            label={MSG.team}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <div className={styles.activeItem}>
            <ColorTag color={getDomainColor(filteredDomainId)} />
            <div
              className={classNames(
                styles.activeItemLabel,
                styles.lockedActiveItemLabel,
              )}
            >
              {domain?.name}
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
            label={MSG.rate}
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
            label={MSG.limit}
            appearance={{
              direction: 'horizontal',
            }}
          />
          <span className={styles.value}>
            <FormattedMessage {...MSG.endsValue} />
          </span>
        </div>
      </DialogSection>
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

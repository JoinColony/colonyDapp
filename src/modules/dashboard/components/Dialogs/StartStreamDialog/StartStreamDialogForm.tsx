import { FormikProps } from 'formik';
import React, { Fragment, useCallback, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import Button from '~core/Button';
import { DialogSection } from '~core/Dialog';
import { Annotations, FormSection, Toggle } from '~core/Fields';
import Heading from '~core/Heading';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { Colony } from '~data/index';
import { ValuesType } from '~pages/ExpenditurePage/types';

import FundingSource from './FundingSource';
import { FormValues } from './StartStreamDialog';
import StreamingDetails from './StreamingDetails';
import {
  user,
  endDate,
  endDateTime,
  startDate,
} from './StreamingDetails/constants';
import styles from './StartStreamDialog.css';

const displayName = 'dashboard.StartStreamDialog.StartStreamDialogForm';

const MSG = defineMessages({
  title: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.title',
    defaultMessage: 'Create a Motion to Start Stream',
  },
  description: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.title',
    defaultMessage: `To create this Streaming Payment you need to have Adminstration permissions or get collective approval first. To get collective approval, you can create a Motion.`,
  },
  createMotion: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.title',
    defaultMessage: 'Create Motion',
  },
  streamingDetails: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.streamingDetails',
    defaultMessage: 'Streaming Details',
  },
  fundingSource: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.fundingSource',
    defaultMessage: '{count}. Funding Source',
  },
  annotationLabel: {
    id: 'dashboard.StartStreamDialog.StartStreamDialogForm.annotationLabel',
    defaultMessage: `Explain why you're creating expenditure`,
  },
});

interface Props {
  colony: Colony;
  onClick: VoidFunction;
  isVotingExtensionEnabled: boolean;
  close: VoidFunction;
  formValues: ValuesType;
}

const StartStreamDialogForm = ({
  colony,
  onClick,
  handleSubmit,
  close,
  formValues,
}: Props & FormikProps<FormValues>) => {
  const { streaming } = formValues;
  const [domainID, setDomainID] = useState<number>();

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setDomainID(motionDomainId),
    [],
  );

  const filterDomains = useCallback((optionDomain) => {
    const optionDomainId = parseInt(optionDomain.value, 10);

    return optionDomainId !== COLONY_TOTAL_BALANCE_DOMAIN_ID;
  }, []);

  return (
    <>
      <DialogSection appearance={{ theme: 'heading' }}>
        <MotionDomainSelect
          colony={colony}
          filterDomains={filterDomains}
          onDomainChange={handleMotionDomainChange}
          initialSelectedDomain={domainID}
        />

        <div className={styles.toggleContainer}>
          <Toggle
            label={{ id: 'label.force' }}
            name="forceAction"
            appearance={{ theme: 'danger' }}
            disabled={false} // temporary value
            tooltipText={{ id: 'tooltip.forceAction' }}
            tooltipPopperOptions={{
              placement: 'top-end',
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [4, 6],
                  },
                },
              ],
              strategy: 'fixed',
            }}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <Heading
          appearance={{ size: 'medium', margin: 'none' }}
          className={styles.title}
        >
          <FormattedMessage {...MSG.title} />
        </Heading>
        <div className={styles.description}>
          <FormattedMessage {...MSG.description} />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <FormSection appearance={{ border: 'bottom' }}>
          <div className={styles.sectionTitle}>
            <FormattedMessage {...MSG.streamingDetails} />
          </div>
        </FormSection>
        <StreamingDetails {...{ user, endDate, endDateTime, startDate }} />
        {streaming?.fundingSources?.map((fundingSource, index) => {
          return (
            <Fragment key={fundingSource.id}>
              <FormSection appearance={{ border: 'bottom' }}>
                <div className={styles.sectionTitle}>
                  <FormattedMessage
                    {...MSG.fundingSource}
                    values={{ count: index + 1 }}
                  />
                </div>
              </FormSection>
              <FundingSource
                fundingSource={fundingSource}
                colony={colony}
                endDate={formValues.streaming?.endDate.option}
              />
            </Fragment>
          );
        })}
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.annotationsWrapper}>
          <Annotations
            label={MSG.annotationLabel}
            name="annotationMessage"
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
          autoFocus
          text={MSG.createMotion}
          data-test="confirmButton"
          onClick={() => {
            // onClick and close are temporary, only handleSubmit should stay here
            onClick();
            close();
            handleSubmit();
          }}
        />
      </DialogSection>
    </>
  );
};

StartStreamDialogForm.displayName = displayName;

export default StartStreamDialogForm;

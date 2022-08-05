import React, { useCallback, useState } from 'react';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';
import { Editor } from '@tiptap/react';
import { FormikProps } from 'formik';
import { defineMessages } from 'react-intl';

import Button from '~core/Button';
import { DialogProps, DialogSection } from '~core/Dialog';
import { Input, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import QuestionMarkTooltip from '~core/QuestionMarkTooltip';
import RichTextEditor from '~core/RichTextEditor/RichTextEditor';
import MotionDomainSelect from '~dashboard/MotionDomainSelect';
import { Colony } from '~data/index';

import { FormValues } from './NewDecisionDialog';

import styles from './NewDecisionDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.title',
    defaultMessage: 'Decision Details',
  },
  decisionTitle: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.decisionTitle',
    defaultMessage: 'Title',
  },
  titlePlaceholder: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.titlePlaceholder',
    defaultMessage: 'Enter a title for your decision...',
  },
  inputLabel: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.inputLabel',
    defaultMessage: 'Describe the decision you need to make',
  },
  preview: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.preview',
    defaultMessage: 'Preview',
  },
  tooltip: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.preview',
    defaultMessage: `The title will be used on both the Decisions page and Decisions list. It should succinctly define the decision to be made.`,
  },
  domainDisplay: {
    id: 'dashboard.NewDecisionDialog.NewDecisionDialogForm.domainDisplay',
    defaultMessage: `Proposal will be created in `,
  },
});

const displayName = 'dashboard.NewDecisionDialogForm';

interface Props extends Omit<DialogProps, 'close'> {
  colony: Colony;
  ethDomainId: number;
  editor: Editor | null;
  limit: number;
}

const NewDecisionDialogForm = ({
  colony,
  setFieldValue,
  values,
  isSubmitting,
  handleSubmit,
  isValid,
  cancel,
  ethDomainId: preselectedDomainId,
  editor,
  limit,
  dirty,
}: Props & FormikProps<FormValues>) => {
  const selectedDomain =
    preselectedDomainId === 0 || preselectedDomainId === undefined
      ? ROOT_DOMAIN_ID
      : preselectedDomainId;

  const domainId = values.motionDomainId || selectedDomain;
  const [currentFromDomain] = useState<number>(domainId);

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
    [setFieldValue],
  );

  const handleFilterMotionDomains = useCallback(
    (optionDomain) => {
      const optionDomainId = parseInt(optionDomain.value, 10);
      if (currentFromDomain === ROOT_DOMAIN_ID) {
        return optionDomainId === ROOT_DOMAIN_ID;
      }
      return (
        optionDomainId === currentFromDomain ||
        optionDomainId === ROOT_DOMAIN_ID
      );
    },
    [currentFromDomain],
  );

  return (
    <div className={styles.main}>
      <DialogSection>
        <MotionDomainSelect
          colony={colony}
          onDomainChange={handleMotionDomainChange}
          filterDomains={handleFilterMotionDomains}
          initialSelectedDomain={domainId}
          dropdownLabel={MSG.domainDisplay}
        />
        <Heading
          appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
          text={MSG.title}
        />
      </DialogSection>
      <DialogSection>
        <div className={styles.label}>
          <InputLabel
            appearance={{ colorSchema: 'grey', theme: 'fat' }}
            label={MSG.decisionTitle}
          />
          <QuestionMarkTooltip
            tooltipText={MSG.tooltip}
            tooltipClassName={styles.tooltipContainer}
            tooltipPopperOptions={{
              placement: 'top-end',
            }}
          />
        </div>
        <Input
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          name="decisionTitle"
          disabled={isSubmitting}
          maxLength={50}
          placeholder={MSG.titlePlaceholder}
          dataTest="decisionTitleInput"
        />
      </DialogSection>
      <DialogSection>
        <InputLabel
          label={MSG.inputLabel}
          appearance={{ colorSchema: 'grey' }}
        />
        {editor && (
          <RichTextEditor
            editor={editor}
            isSubmitting={isSubmitting}
            limit={limit}
          />
        )}
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={cancel}
          text={{ id: 'button.cancel' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          style={{ width: styles.wideButton }}
          onClick={() => handleSubmit()}
          text={MSG.preview}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || !dirty}
          data-test="decisionPreviewButton"
        />
      </DialogSection>
    </div>
  );
};

NewDecisionDialogForm.displayName = displayName;

export default NewDecisionDialogForm;

import React, { useCallback, useRef } from 'react';
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
import NotEnoughReputation from '~dashboard/NotEnoughReputation';
import { Colony } from '~data/index';
import { useColonyReputation } from '~utils/hooks/useColonyReputation';

import { FormValues } from './DecisionDialog';

import styles from './DecisionDialogForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.title',
    defaultMessage: 'Decision Details',
  },
  decisionTitle: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.decisionTitle',
    defaultMessage: 'Title',
  },
  titlePlaceholder: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.titlePlaceholder',
    defaultMessage: 'Enter a title for your decision...',
  },
  inputLabel: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.inputLabel',
    defaultMessage: 'Describe the decision you need to make',
  },
  tooltip: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.preview',
    defaultMessage: `The title will be used on both the Decisions page and Decisions list. It should succinctly define the decision to be made.`,
  },
  domainDisplay: {
    id: 'dashboard.DecisionDialog.DecisionDialogForm.domainDisplay',
    defaultMessage: `Proposal will be created in `,
  },
});

const displayName = 'dashboard.DecisionDialogForm';

interface Props extends Omit<DialogProps, 'close'> {
  colony: Colony;
  ethDomainId: number;
  editor: Editor | null;
  limit: number;
}

const DecisionDialogForm = ({
  colony,
  colony: { colonyAddress },
  setFieldValue,
  values,
  isSubmitting,
  handleSubmit,
  isValid,
  cancel,
  editor,
  limit,
  dirty,
  ethDomainId: preselectedDomainId,
}: Props & FormikProps<FormValues>) => {
  const hasReputation = useColonyReputation(
    colonyAddress,
    values.motionDomainId,
  );

  const handleMotionDomainChange = useCallback(
    (motionDomainId) => setFieldValue('motionDomainId', motionDomainId),
    [setFieldValue],
  );

  const titleOnOpen = useRef(values.title);

  return (
    <div className={styles.main}>
      <DialogSection>
        <MotionDomainSelect
          colony={colony}
          onDomainChange={handleMotionDomainChange}
          dropdownLabel={MSG.domainDisplay}
          disabled={isSubmitting}
          initialSelectedDomain={preselectedDomainId}
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
          name="title"
          disabled={isSubmitting || !hasReputation}
          maxLength={50}
          placeholder={MSG.titlePlaceholder}
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
            name="description"
            disabled={!hasReputation}
          />
        )}
      </DialogSection>
      {!hasReputation && (
        <NotEnoughReputation
          domainId={values.motionDomainId}
          includeForceCopy={false}
        />
      )}
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
          text={{
            id: titleOnOpen.current ? 'button.update' : 'button.preview',
          }}
          loading={isSubmitting}
          disabled={!isValid || isSubmitting || !dirty || !hasReputation}
        />
      </DialogSection>
    </div>
  );
};

DecisionDialogForm.displayName = displayName;

export default DecisionDialogForm;

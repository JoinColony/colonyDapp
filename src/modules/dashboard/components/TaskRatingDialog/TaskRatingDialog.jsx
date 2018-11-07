/* @flow */

import type { FormikProps } from 'formik';

import React, { Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import Dialog from '~core/Dialog';
import DialogSection from '~core/Dialog/DialogSection.jsx';
import { Form, Radio } from '~core/Fields';
import Heading from '~core/Heading';
import Icon from '~core/Icon';

import styles from './TaskRatingDialog.css';

const MSG = defineMessages({
  rateManager: {
    id: 'dashboard.TaskRatingDialog.rateManager',
    defaultMessage: 'Rate Manager',
  },
  endTaskRateManagerDescription: {
    id: 'dashboard.TaskRatingDialog.endTaskRateManagerDescription',
    defaultMessage:
      'Please rate the manager of this task based on the criteria below.',
  },
  ratingStar: {
    id: 'dashboard.TaskRatingDialog.ratingStar',
    defaultMessage: 'Rating Star',
  },
  managerRating3Title: {
    id: 'dashboard.TaskRatingDialog.managerRating3Title',
    defaultMessage: 'Above and beyond',
  },
  managerRating3Description: {
    id: 'dashboard.TaskRatingDialog.managerRating3Description',
    defaultMessage: 'The manager went above and beyond in their role.',
  },
  managerRating2Title: {
    id: 'dashboard.TaskRatingDialog.managerRating2Title',
    defaultMessage: 'Good',
  },
  managerRating2Description: {
    id: 'dashboard.TaskRatingDialog.managerRating2Description',
    defaultMessage: 'The manager performed their role well and as expected.',
  },
  managerRating1Title: {
    id: 'dashboard.TaskRatingDialog.managerRating1Title',
    defaultMessage: 'Unacceptable',
  },
  managerRating1Description: {
    id: 'dashboard.TaskRatingDialog.managerRating1Description',
    defaultMessage:
      'Warning: this may result in a reputation penalty to the manager.',
  },
});

type FormValues = {
  rating: number,
};

type Props = {
  cancel: () => void,
  close: () => void,
};

const displayName = 'dashboard.TaskRatingDialog';

const validationSchema = yup.object().shape({
  rating: yup.string().required('ARg!!!!'),
});

const TaskRatingDialog = ({ cancel }: Props) => (
  <Dialog cancel={cancel} className={styles.main}>
    <Form
      initialValues={{
        rating: '',
      }}
      /* eslint-disable-next-line no-console */
      onSubmit={(values: FormValues) => console.log(`[${displayName}]`, values)}
      validationSchema={validationSchema}
    >
      {({
        isSubmitting,
        isValid,
        values: { rating },
      }: FormikProps<FormValues>) => (
        <Fragment>
          <DialogSection>
            <div className={styles.contentWrapper}>
              <Heading appearance={{ size: 'medium' }} text={MSG.rateManager} />
              <p className={styles.descriptionText}>
                <FormattedMessage {...MSG.endTaskRateManagerDescription} />
              </p>
              <section className={styles.ratingSection}>
                {/*
                 * Three star rating
                 */}
                <Radio
                  checked={parseInt(rating, 10) === 3}
                  name="rating"
                  value={3}
                >
                  <div className={styles.ratingItem}>
                    <div className={styles.ratingText}>
                      <Heading
                        appearance={{ size: 'normal', margin: 'none' }}
                        text={MSG.managerRating3Title}
                      />
                      <p className={styles.ratingItemDescription}>
                        <FormattedMessage {...MSG.managerRating3Description} />
                      </p>
                    </div>
                    <div className={styles.ratingStars}>
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                    </div>
                  </div>
                </Radio>
                {/*
                 * Two star rating
                 */}
                <Radio
                  checked={parseInt(rating, 10) === 2}
                  name="rating"
                  value={2}
                >
                  <div className={styles.ratingItem}>
                    <div className={styles.ratingText}>
                      <Heading
                        appearance={{ size: 'normal', margin: 'none' }}
                        text={MSG.managerRating2Title}
                      />
                      <p className={styles.ratingItemDescription}>
                        <FormattedMessage {...MSG.managerRating2Description} />
                      </p>
                    </div>
                    <div className={styles.ratingStars}>
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        className={styles.ratingStarUnselected}
                      />
                    </div>
                  </div>
                </Radio>
                {/*
                 * One star rating
                 */}
                <Radio
                  checked={parseInt(rating, 10) === 1}
                  name="rating"
                  value={1}
                >
                  <div className={styles.ratingItem}>
                    <div className={styles.ratingText}>
                      <Heading
                        appearance={{ size: 'normal', margin: 'none' }}
                        text={MSG.managerRating1Title}
                      />
                      <p className={styles.ratingItemWarning}>
                        <FormattedMessage {...MSG.managerRating1Description} />
                      </p>
                    </div>
                    <div className={styles.ratingStars}>
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        appearance={{ size: 'tiny', theme: 'primary' }}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        className={styles.ratingStarUnselected}
                      />
                      <Icon
                        name="star"
                        title={MSG.ratingStar}
                        className={styles.ratingStarUnselected}
                      />
                    </div>
                  </div>
                </Radio>
              </section>
            </div>
          </DialogSection>
          <DialogSection appearance={{ align: 'right' }}>
            <Button
              className={styles.customCancelButton}
              onClick={cancel}
              text={{ id: 'button.cancel' }}
            />
            <Button
              appearance={{ theme: 'primary', size: 'large' }}
              disabled={!isValid}
              loading={isSubmitting}
              text={{ id: 'button.confirm' }}
              type="submit"
            />
          </DialogSection>
        </Fragment>
      )}
    </Form>
  </Dialog>
);

TaskRatingDialog.displayName = displayName;

export default TaskRatingDialog;

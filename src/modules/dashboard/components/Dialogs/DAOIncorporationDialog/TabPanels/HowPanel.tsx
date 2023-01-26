import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Tag from '~core/Tag';

import styles from './TabPanels.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.title',
    defaultMessage: 'How it works? ',
  },
  description: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.description',
    defaultMessage: `Just like a DAO, incorporation is done openly and collectively. The steps involved in the process include:`,
  },
  step1: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step1',
    defaultMessage: `Start the application process by providing the required details, explain the reason for doing so, and nominate Protectors for the legal entity.<div> Step time: ~3 minutes </div>`,
  },
  step2: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step2',
    defaultMessage: `Submit the application to make it open. As the owner of the application, a stake is required to prevent too many unwanted applications.<div> Step time: ~1 minute </div>`,
  },
  step3: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step3',
    defaultMessage: `With the application open, collective discussion can happen to agree to all the details, nominated Protectors, and the cost to incorporate. Protectors will also need to submit verification details in the step.<div> Step time: Dependent on parties involved </div>`,
  },
  step4: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step4',
    defaultMessage: `Create a Motion to pay for the incorporation. This is the final step to get collective approval of the decision.<div> Step time: Dependent on Motion duration </div>`,
  },
  step5: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step5',
    defaultMessage: `Korporatio will process the application and finalise the incorporate. The DAO will then be able to start benefitting for a legal DAO wrapper.<div> Step time: 15 - 20 business days </div>`,
  },
  step: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel.step',
    defaultMessage: 'Step {count}',
  },
});

const steps = [MSG.step1, MSG.step2, MSG.step3, MSG.step4, MSG.step5];

const displayName = 'dashboard.DAOIncorporationDialog.TabPanels.HowPanel';

const HowPanel = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
      <div className={styles.description}>
        <FormattedMessage {...MSG.description} />
      </div>
      <ul className={styles.benefits}>
        {steps.map((benefit, index) => (
          <li key={benefit.id} className={styles.stepItem}>
            <div className={styles.stepWrapper}>
              <Tag appearance={{ theme: 'blue' }}>
                <FormattedMessage {...MSG.step} values={{ count: index + 1 }} />
              </Tag>
              <div>
                <FormattedMessage
                  {...benefit}
                  values={{
                    div: (chunks) => (
                      <div className={styles.time}>{chunks}</div>
                    ),
                  }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

HowPanel.displayName = displayName;

export default HowPanel;

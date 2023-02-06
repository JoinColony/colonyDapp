import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Link from '~core/Link';
import Tag from '~core/Tag';

import styles from './TabPanels.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.title',
    defaultMessage: 'Why incorporate your DAO',
  },
  description: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.description',
    defaultMessage: `Setup a legal wrapper for you DAO to extend it's functionality and help protect contributors. Incorporation is done in Panama through a service provided by Korporatio. Who is specifically focused on helping to support smart companies built and run on-chain.`,
  },
  note: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.note',
    defaultMessage: `Note: It is important to understand the obligations of incorporation. <a> Learn More </a>`,
  },
  benefits: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.benefits',
    defaultMessage: `Benefits`,
  },
  benefit1: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.benefit1',
    defaultMessage: `A legal structure ideally suited to the <strong> needs of DAOs operating internationally. </strong>`,
  },
  benefit2: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.benefit2',
    defaultMessage: `Enjoy <strong> limited liability for your DAO </strong> to protect contributors and token holders.`,
  },
  benefit3: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.benefit3',
    defaultMessage: `Be able to <strong> operate and interact </strong> with traditional legal organistations.`,
  },
  benefit4: {
    id: 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel.benefit4',
    defaultMessage: `Benefit from law jurisdictions for <strong> tax and contractual purposes. </strong>`,
  },
});

const benefits = [MSG.benefit1, MSG.benefit2, MSG.benefit3, MSG.benefit4];

const displayName = 'dashboard.DAOIncorporationDialog.TabPanels.WhyPanel';

const WhyPanel = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <FormattedMessage {...MSG.title} />
      </div>
      <div className={styles.description}>
        <FormattedMessage {...MSG.description} />
        <div className={styles.note}>
          <FormattedMessage
            {...MSG.note}
            values={{
              a: (chunks) => (
                <Link to="/" className={styles.link} target="_blank">
                  {chunks}
                </Link>
              ),
            }}
          />
        </div>
      </div>
      <Tag appearance={{ theme: 'blue' }}>
        <FormattedMessage {...MSG.benefits} />
      </Tag>
      <ul className={styles.benefits}>
        {benefits.map((benefit) => (
          <li key={benefit.id} className={styles.benefitItem}>
            <FormattedMessage
              {...benefit}
              values={{
                strong: (chunks) => (
                  <strong className={styles.boldText}>{chunks}</strong>
                ),
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

WhyPanel.displayName = displayName;

export default WhyPanel;

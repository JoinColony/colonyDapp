import React from 'react';
import Icon from '~core/Icon';
import { FormattedMessage } from 'react-intl';
import Paragraph from '~core/Paragraph';

interface Props {
  title: object;
  description: object;

}

const ColonyActionsItem = ({
  title,
  description
}: Props) => {

  return (
    <div>
      <Paragraph ><FormattedMessage {...title} /></Paragraph>
      <Paragraph ><FormattedMessage {...description} /></Paragraph>
      <Icon
        appearance={{ size: 'medium' }}
        name="caret-right"
        title={title}
      />
    </div>
  );
};

export default ColonyActionsItem;

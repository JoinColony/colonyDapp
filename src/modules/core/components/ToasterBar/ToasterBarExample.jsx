/* @flow */
import React from 'react';
import Button from '../Button';

import ToasterBar from './ToasterBar.jsx';
import ToasterBarComponent from './ToasterBarComponent.jsx';

type Props = {
  cancel: () => void,
  close: (val: any) => void,
};

const ToasterBarExample = ({ cancel, close }: Props) => (
  <ToasterBar cancel={cancel} close={close}>
    {({ requiresInteraction, setRequiresInteraction }) =>
      requiresInteraction ? (
        <ToasterBarComponent>
          <div>HELLO I need your attention!!! You can now only... </div>
          <Button onClick={cancel}>dismiss</Button>
          <Button onClick={close}>or confirm</Button>
        </ToasterBarComponent>
      ) : (
        <ToasterBarComponent>
          <div>you can just dismiss me or ... </div>
          <Button onClick={() => setRequiresInteraction(true)}>
            make me require your attention
          </Button>
        </ToasterBarComponent>
      )
    }
  </ToasterBar>
);

export default ToasterBarExample;
import { useEffect } from 'react';
import { useDispatch } from 'redux-react-hook';

import { MessageType } from '~immutable/index';

import { messageSign } from '../../../../core/actionCreators';

interface Props {
  message: MessageType;
}

const displayName = 'users.GasStation.MessageCardControls';

const MessageCardControls = ({ message: { id } }: Props) => {
  const dispatch = useDispatch();

  /*
   * @NOTE Automatically sign the message
   *
   * Since we're just using Metamask, we won't wait for the user to click the "Confirm"
   * button anymore, we just dispatch the action to sign the message, and the user
   * will deal with _confirm-ing_ the action using Metamask's interface.
   */
  useEffect(() => {
    dispatch(messageSign(id));
  }, [dispatch, id]);

  return null;
};

MessageCardControls.displayName = displayName;

export default MessageCardControls;

import React, { useEffect, useRef, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';

import { Form, TextareaAutoresize } from '~core/Fields';
import { useLoggedInUser } from '~data/index';

import ChatMessage from './ChatMessage';

import styles from './Chat.css';

const MSG = defineMessages({
  emptyText: {
    id: 'Chat.emptyText',
    defaultMessage: 'Nobody’s said anything yet... 😢',
  },
  labelLeaveComment: {
    id: 'Chat.labelLeaveComment',
    defaultMessage: 'Leave a comment',
  },
  loginToComment: {
    id: 'Chat.loginToComment',
    defaultMessage: 'Login to comment',
  },
});

// @todo Obviously this is not the right interface for the data we get in the future
interface Comment {
  author: string;
  comment: string;
  id: string;
  timestamp: number;
}

const displayName = 'Chat';

const validationSchema = yup.object().shape({
  comment: yup.string().required(),
});

const Chat = () => {
  const { username } = useLoggedInUser();
  const scrollElmRef = useRef<HTMLDivElement | null>(null);
  // @todo get that from somewhere I guess (ref is just for fake-persistence)
  const [messages] = useState<Comment[]>([]);
  // eslint-disable-next-line no-console
  const handleCommentSubmit = () => console.log('submitting comment');

  useEffect(() => {
    if (scrollElmRef.current) {
      scrollElmRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.main}>
      <div className={styles.messages}>
        {messages && messages.length ? (
          messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))
        ) : (
          <FormattedMessage {...MSG.emptyText} />
        )}
        <div ref={scrollElmRef} />
      </div>
      <div className={styles.inputBox}>
        <Form
          validationSchema={validationSchema}
          initialValues={{ comment: '' }}
          onSubmit={handleCommentSubmit}
        >
          {({ resetForm, submitForm }) => (
            // This is non-ideal but we use this hack as the autoresize textarea doesn't support
            // the shift key modifier
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <div
              role="form"
              onKeyDown={async (evt) => {
                if (evt.key === 'Enter' && !evt.shiftKey) {
                  evt.preventDefault();
                  await submitForm();
                  resetForm();
                }
              }}
            >
              <TextareaAutoresize
                appearance={{ colorSchema: 'grey' }}
                elementOnly
                disabled={!username}
                label={MSG.labelLeaveComment}
                name="comment"
                placeholder={
                  username ? MSG.labelLeaveComment : MSG.loginToComment
                }
              />
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

Chat.displayName = displayName;

export default Chat;

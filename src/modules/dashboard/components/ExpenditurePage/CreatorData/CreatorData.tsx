import React from 'react';
import { Form, Select } from '~core/Fields';

const CreatorData = () => {
  return (
    <Form
      initialValues={{ input: '' }}
      initialErrors={{ input: 'Wrong!' }}
      onSubmit={() => {}}
    >
      <Select
        name="input"
        placeholder="I'm wrong as well!"
        label="Expenditure type"
        appearance={{ borderedOptions: 'false' }}
        options={[
          { label: 'Advanced payment', value: 'advanced' },
          { label: 'Recurring payment', value: 'recurring' },
          { label: 'Task', value: 'task' },
        ]}
      />
    </Form>
  );
};

export default CreatorData;

import { useEffect, useRef } from 'react';
import ReactDatePicker from 'react-datepicker';

import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';

const useDateTriggerFocus = (name: string, disabled: boolean | undefined) => {
  const datePickerRef = useRef<ReactDatePicker>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const fixAction = (e) => {
      const {
        detail: { name: targetName },
      } = e;

      // isDesiredEl tells to trigger only needed element and not for example all elements in the listing
      const isDesiredEl = targetName === name;

      if (!disabled && isDesiredEl) {
        datePickerRef?.current?.setOpen(true);
      }
    };

    // custom event is being used here - which was created specially for elements with additional onFocus logic
    window.addEventListener(FIX_TRIGGER_EVENT_NAME, fixAction);

    return () => {
      window.removeEventListener(FIX_TRIGGER_EVENT_NAME, fixAction);
      clearTimeout(timeout);
    };
  }, [name, disabled]);

  return { datePickerRef };
};

export default useDateTriggerFocus;

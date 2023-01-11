import { useEffect, useRef } from 'react';

import { FIX_TRIGGER_EVENT_NAME } from '~pages/ExpenditurePage/constants';

const useUserTriggerFocus = (
  name: string,
  disabled: boolean | undefined,
  toggleDropdown: () => void,
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const fixAction = (e) => {
      const {
        detail: { name: targetName },
      } = e;
      // isDesiredEl tells to trigger only needed element and not for example all elements in the listing
      const isDesiredEl = targetName === name;

      if (!disabled && isDesiredEl) {
        toggleDropdown();
        timeout = setTimeout(() => {
          inputRef?.current?.focus();
        }, 1);
      }
    };

    // custom event is being used here - which was created specially for elements with additional onFocus logic
    window.addEventListener(FIX_TRIGGER_EVENT_NAME, fixAction);

    return () => {
      window.removeEventListener(FIX_TRIGGER_EVENT_NAME, fixAction);
      clearTimeout(timeout);
    };
  }, [disabled, toggleDropdown, name]);

  return { inputRef };
};

export default useUserTriggerFocus;

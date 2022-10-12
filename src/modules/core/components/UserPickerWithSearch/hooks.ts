import { useEffect, useRef } from 'react';

import { fixTriggerEventName } from '~pages/ExpenditurePage/constants';

const useUserTriggerFocus = (
  index: number,
  disabled: boolean | undefined,
  toggleDropdown: () => void,
) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const fixAction = (e) => {
      const {
        detail: { order },
      } = e;
      // isDesiredEl tells to trigger only needed element and not for example all elements in the listing
      const isDesiredEl = order === index;

      if (!disabled && isDesiredEl) {
        toggleDropdown();
        timeout = setTimeout(() => {
          inputRef?.current?.focus();
        }, 1);
      }
    };

    // custom event is being used here - which was created specially for elements with additional onFocus logic
    window.addEventListener(fixTriggerEventName, fixAction);

    return () => {
      window.removeEventListener(fixTriggerEventName, fixAction);
      clearTimeout(timeout);
    };
  }, [index, disabled, toggleDropdown]);

  return { inputRef };
};

export default useUserTriggerFocus;

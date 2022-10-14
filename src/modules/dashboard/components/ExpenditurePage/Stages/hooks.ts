export const useObserver = (
  setFieldErrorsAmount: React.Dispatch<React.SetStateAction<number>>,
) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        const nodeListLength = document
          .getElementById('expenditurePage')
          ?.querySelectorAll('[aria-invalid="true"]').length;

        setFieldErrorsAmount(nodeListLength || 0);
      }
    });
  });

  return { observer };
};

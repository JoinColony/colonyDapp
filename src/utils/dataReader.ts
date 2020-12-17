export const getBase64image = (blob): Promise<any> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      return resolve(fileReader.result);
    };
    fileReader.readAsDataURL(blob);
  });
};

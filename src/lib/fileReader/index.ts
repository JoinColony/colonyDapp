const fileReaderFactory = (options: any) => {
  function defaultFileReadingFunction(reader, file) {
    reader.readAsDataURL(file);
  }

  const config = {
    maxFileSize: 1024 * 1024, // that's about 1MB
    maxFilesLimit: 10,
    allowedTypes: [],
    fileReadingFn: defaultFileReadingFunction,
    ...options,
  };

  function hasValidType(file) {
    return !config.allowedTypes.includes(file.type);
  }

  function hasInvalidFileSize(file) {
    return file && config.maxFileSize && file.size > config.maxFileSize;
  }

  function readFilePromise(file): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        if (!evt || !evt.target || !evt.target.result) {
          reject(
            new Error(
              'An unexpected error occurred while trying to read the file ' +
                'sent.',
            ),
          );
        }

        const { name, type, size, lastModified } = file;
        resolve({
          name,
          type,
          size,
          lastModified,
          uploadDate: Date.now(),
          data: evt.target.result,
        });
      };

      config.fileReadingFn(reader, file);
    });
  }

  return async function fileReader(files: any[]) {
    if (!files) {
      throw new Error(
        'An unexpected input was given, should receive files to upload.',
      );
    }

    if (config.maxFilesLimit && files.length > config.maxFilesLimit) {
      throw new Error(
        `You can only have ${config.maxFilesLimit} or fewer attached file(s)`,
      );
    }

    const sizeValidationErrors = files.filter(hasInvalidFileSize);
    if (sizeValidationErrors && sizeValidationErrors.length) {
      const fileSize = config.maxFileSize / (1024 * 1024);
      throw new Error(
        `Please provide files that is smaller or equal to ${fileSize}MB`,
      );
    }

    const allowedTypesValidationErrors = files.filter(hasValidType);
    if (allowedTypesValidationErrors && allowedTypesValidationErrors.length) {
      const allowedTypes = config.allowedTypes.join(', ');
      throw new Error(
        `Only types: ${allowedTypes} are allowed to be uploaded.`,
      );
    }

    const fileReadingPromises = files.map(readFilePromise);
    return Promise.all(fileReadingPromises);
  };
};

export default fileReaderFactory;

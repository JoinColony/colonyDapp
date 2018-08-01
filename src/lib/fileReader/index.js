/* @flow */

const fileReaderFactory = (options: Object): Function => {
  const defaultOptions = Object.assign(
    {
      maxFileSize: 1024 * 1024, // that's about 1MB
      maxFilesLimit: 10,
      allowedExtensions: [
        'gif',
        'png',
        'jpg',
        'jpeg',
        'pdf',
        'psd',
        'docx',
        'xlsx',
        'zip',
        'rar',
        'txt',
        'markdown',
        'md',
      ],
      fileReadingFn: defaultFileReadingFunction,
    },
    options,
  );

  return async function fileReader(files: Array<Object>) {
    if (!files) {
      throw new Error(
        'An unexpected input was given, should receive files to upload.',
      );
    }

    if (
      defaultOptions.maxFilesLimit &&
      files.length > defaultOptions.maxFilesLimit
    ) {
      throw new Error(
        `You can only have ${
          defaultOptions.maxFilesLimit
        } or less attached file(s)`,
      );
    }

    const sizeValidationErrors = files.filter(hasInvalidFileSize);
    if (sizeValidationErrors && sizeValidationErrors.length) {
      const fileSize = defaultOptions.maxFileSize / (1024 * 1024);
      throw new Error(
        `Please provide files that is smaller or equal to ${fileSize}MB`,
      );
    }

    const allowedExtensionsValidationErrors = files.filter(
      hasInvalidExtensions,
    );
    if (
      allowedExtensionsValidationErrors &&
      allowedExtensionsValidationErrors.length
    ) {
      const allowedExtensions = defaultOptions.allowedExtensions.join(', ');
      throw new Error(
        `Only extensions: ${allowedExtensions} are allowed to be uploaded.`,
      );
    }

    const fileReadingPromises = files.map(readFilePromise);
    return Promise.all(fileReadingPromises);
  };

  function getFileExtension(filename) {
    return filename.split('.').pop();
  }

  function hasInvalidExtensions(file) {
    return (
      file &&
      defaultOptions.allowedExtensions &&
      defaultOptions.allowedExtensions.indexOf(
        getFileExtension(file.name.toLowerCase()),
      ) === -1
    );
  }

  function hasInvalidFileSize(file) {
    return (
      file &&
      defaultOptions.maxFileSize &&
      file.size > defaultOptions.maxFileSize
    );
  }

  function defaultFileReadingFunction(reader, file) {
    reader.readAsDataURL(file);
  }

  function readFilePromise(file): Promise<Object> {
    return new Promise(async (accept, reject) => {
      const reader = new FileReader();
      reader.onload = evt => {
        if (!evt || !evt.target || !evt.target.result) {
          reject(
            new Error(
              'An unexpected error occurred while trying to read the file ' +
                'sent.',
            ),
          );
        }

        const { name, type, size, lastModified } = file;
        accept({
          name,
          type,
          size,
          lastModified,
          uploadDate: Date.now(),
          data: evt.target.result,
        });
      };

      defaultOptions.fileReadingFn(reader, file);
    });
  }
};

export default fileReaderFactory;

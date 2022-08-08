import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { useField } from 'formik';
import isNil from 'lodash/isNil';

import { defineMessages } from 'react-intl';
import FileUpload from '~core/FileUpload';
import Button from '~core/Button';

import CSVUploaderItem from './CSVUploaderItem';

interface Props {
  name: string;
  processingData: boolean;
  setProcessingData: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

export const MSG = defineMessages({
  upload: {
    id: 'dashboard.ExpenditurePage.Batch.upload',
    defaultMessage: 'Upload .CSV',
  },
});

const MIME_TYPES = ['text/csv'];

const CSVUploader = ({ name, processingData, setProcessingData }: Props) => {
  const [CSVFile, setCSVFile] = useState<File | null>(null);
  const [parsedCSV, setParsedCSV] = useState<ParseResult<unknown> | null>(null);
  const [, { value }, { setValue }] = useField(name);

  useEffect(() => {
    if (CSVFile && !parsedCSV) {
      Papa.parse(CSVFile, {
        complete: setParsedCSV,
        header: true,
      });
    } else if (!CSVFile && parsedCSV) {
      setParsedCSV(null);
    }
  }, [CSVFile, parsedCSV]);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (parsedCSV && value[0] && isNil(value[0].parsedData)) {
      setValue([{ ...value[0], parsedData: parsedCSV.data }]);
    }

    if (processingData) {
      setProcessingData(false);
    }
  }, [parsedCSV, value, setValue, processingData, setProcessingData]);

  return (
    <FileUpload
      name={name}
      upload={(file: File) => setCSVFile(file)}
      dropzoneOptions={{
        accept: MIME_TYPES,
      }}
      itemComponent={CSVUploaderItem}
      processingData={processingData}
      handleProcessingData={setProcessingData}
      maxFilesLimit={1}
      renderPlaceholder={
        <Button
          appearance={{ theme: 'blue' }}
          type="button"
          text={MSG.upload}
        />
      }
      elementOnly
    />
  );
};

CSVUploader.displayName = 'CSVUploader';

export default CSVUploader;

import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { useField } from 'formik';
import { MessageDescriptor } from 'react-intl';
import isNil from 'lodash/isNil';
import FileUpload from '~core/FileUpload';
import CSVUploaderItem from '~core/CSVUploader/CSVUploaderItem';

interface Props {
  name: string;
  error?: string | MessageDescriptor;
  processingData: boolean;
  setProcessingData: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const MIME_TYPES = ['text/csv'];

const CSVUploader = ({
  name,
  error,
  processingData,
  setProcessingData,
  isOpen,
}: Props) => {
  const [CSVFile, setCSVFile] = useState<File | null>(null);
  const [parsedCSV, setParsedCSV] = useState<ParseResult<unknown> | null>(null);
  const [, { value }, { setValue }] = useField(name);

  const handleUploadError = async () => {
    if (isNil(value[0].parsedData)) {
      await setValue([{ ...value[0], parsedData: [] }]);
    }
  };

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
    if (parsedCSV && value[0] && isNil(value[0].parsedData)) {
      setValue([{ ...value[0], parsedData: parsedCSV.data }]);
    }

    if (processingData) {
      setProcessingData(false);
    }
  }, [parsedCSV, value, setValue, processingData, setProcessingData]);

  return isOpen ? (
    <FileUpload
      name={name}
      upload={(file: File) => setCSVFile(file)}
      dropzoneOptions={{
        accept: MIME_TYPES,
      }}
      customErrorMessage={error}
      inputStatusAppearance={{ theme: 'minimal', textSpace: 'wrap' }}
      itemComponent={CSVUploaderItem}
      handleError={handleUploadError}
      processingData={processingData}
      handleProcessingData={setProcessingData}
    />
  ) : null;
};

CSVUploader.displayName = 'CSVUploader';

export default CSVUploader;

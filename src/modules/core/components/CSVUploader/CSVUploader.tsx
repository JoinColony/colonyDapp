import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { useField } from 'formik';
import { MessageDescriptor } from 'react-intl';
import isNil from 'lodash/isNil';

import FileUpload from '../FileUpload';

import CSVUploaderItem from './CSVUploaderItem';

interface Props {
  name: string;
  error?: string | MessageDescriptor;
  processingData: boolean;
  setProcessingData: React.Dispatch<React.SetStateAction<boolean>>;
}

const MIME_TYPES = ['text/csv'];

const CSVUploader = ({
  name,
  error,
  processingData,
  setProcessingData,
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
      if (parsedCSV.meta.fields?.length === 1) {
        const validAddresses = parsedCSV.data.flatMap(
          (CSVRow: Record<string, any>) => {
            const potentialAddress: string = CSVRow[Object.keys(CSVRow)[0]];
            return potentialAddress ? [potentialAddress] : [];
          },
        );

        setValue([{ ...value[0], parsedData: validAddresses }]);
      } else {
        setValue([{ ...value[0], parsedData: [] }]);
      }
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
      customErrorMessage={error}
      inputStatusAppearance={{ theme: 'minimal', textSpace: 'wrap' }}
      itemComponent={CSVUploaderItem}
      handleError={handleUploadError}
      processingData={processingData}
      handleProcessingData={setProcessingData}
    />
  );
};

CSVUploader.displayName = 'CSVUploader';

export default CSVUploader;

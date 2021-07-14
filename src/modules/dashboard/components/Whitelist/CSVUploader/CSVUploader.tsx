import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import { useField } from 'formik';
import { MessageDescriptor } from 'react-intl';

import FileUpload, { UploadFile } from '~core/FileUpload';
import { isAddress } from '~utils/web3';

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
  const [, { value }, { setValue }] = useField<UploadFile[]>(name);

  const handleUploadError = async () => {
    await setValue([{ ...value[0], parsedData: [] }]);
  };

  useEffect(() => {
    if (CSVFile) {
      Papa.parse(CSVFile, {
        complete: setParsedCSV,
        header: true,
      });
    }
  }, [CSVFile]);

  useEffect(() => {
    if (parsedCSV) {
      if (parsedCSV.meta.fields?.length === 1) {
        const validAddresses = parsedCSV.data.flatMap(
          (CSVRow: Record<string, any>) => {
            const headerExpectedName = 'Whitelist Address';
            const potentialAddress: string | null =
              CSVRow[headerExpectedName] ||
              CSVRow[headerExpectedName.toLowerCase()];
            if (potentialAddress) {
              return isAddress(potentialAddress) ? [potentialAddress] : [];
            }
            return [];
          },
        );

        setValue([{ ...value[0], parsedData: validAddresses }]);
      } else {
        setValue([{ ...value[0], parsedData: [] }]);
      }
    }
    setProcessingData(false);
  }, [parsedCSV]);

  return (
    <div>
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
    </div>
  );
};

export default CSVUploader;

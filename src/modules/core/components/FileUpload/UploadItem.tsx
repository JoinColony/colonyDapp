import React, { Component, SyntheticEvent } from 'react';
import { defineMessages } from 'react-intl';

import { FieldEnhancedProps } from '~core/Fields/types';
import { log } from '~utils/debug';

import { UploadFile, UploadItemComponentProps } from './types';
import Button from '../Button';
import { asField } from '../Fields';
import Icon from '../Icon';
import { Tooltip } from '../Popover';
import ProgressBar from '../ProgressBar';

import fileReader from '../../../../lib/fileReader';

import styles from './UploadItem.css';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
});

class UploadItem extends Component<
  UploadItemComponentProps & FieldEnhancedProps<UploadFile>
> {
  _readFiles: (files: object[]) => Promise<object[]>;

  static displayName = 'UploadItem';

  constructor(props) {
    super(props);
    const { accept, maxFileSize } = props;
    // @ts-ignore
    this._readFiles = fileReader({
      maxFilesLimit: 1,
      maxFileSize,
      allowedTypes: accept,
    });
  }

  componentDidMount() {
    const {
      $value: { error, file, uploaded },
    } = this.props;
    if (file && !error && !uploaded) {
      this.uploadFile();
    }
  }

  handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { idx, remove } = this.props;
    evt.stopPropagation();
    remove(idx);
  };

  async uploadFile() {
    const { $value, setValue, upload } = this.props;
    if (!setValue) return;
    let readFile;
    let fileReference;
    const { file } = $value;
    try {
      readFile = await this.read(file);
      setValue({ ...$value, preview: readFile.data });
      fileReference = await upload(readFile);
    } catch (caughtError) {
      log.error(caughtError);

      /**
       * @todo  better error handling here
       */
      setValue({ ...$value, error: 'uploadError' });
      return;
    }
    setValue({ ...$value, preview: readFile.data, uploaded: fileReference });
  }

  read = (file: File) =>
    this._readFiles([file]).then((contents) => contents[0]);

  render() {
    const {
      error,
      $value: { file, uploaded },
    } = this.props;

    return (
      <div className={styles.uploadItem} aria-invalid={!!error}>
        <div className={styles.fileInfo}>
          <Tooltip
            placement="left"
            content={error || null}
            trigger={error ? 'hover' : 'disabled'}
          >
            <span className={styles.itemIcon}>
              <Icon name="file" title={file.name} />
            </span>
          </Tooltip>
          {uploaded || error ? (
            <span>{file.name}</span>
          ) : (
            <div className={styles.itemProgress}>
              <ProgressBar value={uploaded ? 100 : 0} />
            </div>
          )}
        </div>
        <div>
          <Button
            type="button"
            onClick={this.handleRemoveClick}
            appearance={{ theme: 'blue' }}
            text={MSG.removeActionText}
          />
        </div>
      </div>
    );
  }
}

export default asField<UploadItemComponentProps, UploadFile>({
  alwaysConnected: true,
})(UploadItem);

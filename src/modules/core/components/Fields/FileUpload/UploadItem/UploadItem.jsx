/* @flow */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { compose } from 'recompose';

import type { IntlShape, MessageDescriptor } from 'react-intl';

import asField from '../../asField';
import Popover from '../../../Popover';
import Button from '../../../Button';
import Icon from '../../../Icon';
import ProgressBar from '../../../ProgressBar';

import styles from './UploadItem.css';

const MSG = defineMessages({
  removeActionText: {
    id: 'UploadItem.removeActionText',
    defaultMessage: 'Remove',
  },
});

type Props = {
  /** File object */
  file: Object,
  /** Index of file in list of files to be uploaded */
  idx: number,
  /** Text to be shown for removing an item */
  removeActionText?: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  removeActionTextValues?: { [string]: string },
  /** Function to be called if there's an error uploading the file */
  onError: (errorMessage: string) => void,
  /** Function to be called each time a file is uploaded */
  onUploaded: (idx: number, ipfsHash: string) => void,
  /** Function used to read each file during upload */
  read: (file: Object) => any, // TODO better typing
  /** Function used to remove each file from the list of files to upload */
  remove: (idx: number) => void,
  /** Function used to perform the acutal upload action of the file */
  upload: (fileData: any) => any, // TODO better typing
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

type State = {
  error: any,
  uploaded: boolean,
};

const displayName = 'UploadItem';

class UploadItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
      uploaded: false,
    };
  }

  componentDidMount() {
    const { file } = this.props;
    if (file.fileRef && !file.ipfsHash) {
      this.uploadFile(file.fileRef);
    }
  }

  handleRemoveClick = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const { idx, remove } = this.props;
    evt.stopPropagation();
    remove(idx);
  };

  handleError = (e: any) => {
    const { onError } = this.props;
    const error = e.reason || e.message;
    this.setState({
      error,
    });
    if (onError) {
      onError(error);
    }
  };

  async uploadFile(file: Object) {
    const { idx, onUploaded, read, setValue, upload } = this.props;
    let readFile;
    let ipfsHash;
    try {
      readFile = await read(file);
      ipfsHash = await upload(readFile.data);
    } catch (e) {
      this.handleError(e);
      return;
    }
    onUploaded(idx, ipfsHash);
    try {
      setValue(ipfsHash);
    } catch (e) {
      // component isn't connected (connect=false)
    }
    this.setState({ uploaded: true });
  }

  renderRemoveActionText = () => {
    const {
      removeActionText,
      removeActionTextValues,
      intl: { formatMessage },
    } = this.props;
    if (!removeActionText) {
      return formatMessage(MSG.removeActionText);
    }
    if (typeof removeActionText == 'object') {
      return formatMessage(removeActionText, removeActionTextValues);
    }
    return removeActionText;
  };

  render() {
    const { file } = this.props;
    const { error, uploaded } = this.state;
    const invalid = !!error;
    const removeActionText = this.renderRemoveActionText();
    return (
      <div className={styles.uploadItem} aria-invalid={invalid}>
        <div className={styles.fileInfo}>
          <Popover
            placement="left"
            content={error}
            trigger={invalid ? 'hover' : 'disabled'}
          >
            <span className={styles.itemIcon}>
              <Icon name="file" title={file.name} />
            </span>
          </Popover>
          {uploaded || error ? (
            <span className={styles.itemName}>{file.name}</span>
          ) : (
            <div className={styles.itemProgress}>
              <ProgressBar value={uploaded ? 100 : 0} />
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            type="button"
            onClick={this.handleRemoveClick}
            appearance={{ theme: 'blue' }}
          >
            {removeActionText}
          </Button>
        </div>
      </div>
    );
  }
}

UploadItem.displayName = displayName;

export default compose(
  asField,
  injectIntl,
)(UploadItem);

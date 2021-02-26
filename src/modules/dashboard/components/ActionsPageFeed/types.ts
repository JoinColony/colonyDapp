import { MessageDescriptor } from 'react-intl';
import { UniversalMessageValues } from '~types/index';
import { Appearance as SystemInfoAppearance } from './ActionsPageTip';

export enum ActionsPageFeedType {
  /*
   * Events coming from the contracts
   */
  NetworkEvent = 'NetworkEvent',
  /*
   * Comments for the various transactions that are coming from our server
   */
  ServerComment = 'TransactionMessage',
  /*
   * Random tips we can show in the feed
   * Like the ones in Recovery Mode
   */
  SystemInfo = 'SystemInfo',
  /*
   * Automated messages displayed by the dapp at certain treshholds
   * We currently use this to show when the required number
   * of recovery role users approved exiting the current recovery session
   */
  SystemMessage = 'SystemMessage',
}

export interface SystemInfo {
  type: ActionsPageFeedType.SystemInfo;
  text: MessageDescriptor | string;
  position: number;
  textValues?: UniversalMessageValues;
  appearance?: SystemInfoAppearance;
}

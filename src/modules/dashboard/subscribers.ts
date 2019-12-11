import {
  colonyTaskMetadataSubStart,
  colonyTaskMetadataSubStop,
} from './actionCreators';
import {
  colonyTaskMetadataSelector,
} from './selectors';

export const colonyTaskMetadataSubscriber = Object.freeze({
  select: colonyTaskMetadataSelector,
  start: colonyTaskMetadataSubStart,
  stop: colonyTaskMetadataSubStop,
});

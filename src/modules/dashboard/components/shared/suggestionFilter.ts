import { defineMessages } from 'react-intl';
import { SuggestionStatus } from '~data/index';

const SUGGESTIONS_FILTER_MSG = defineMessages({
  filterOptionAll: {
    id: 'dashboard.suggestionsFilter.filterOptionAll',
    defaultMessage: 'All',
  },
  filterOptionOpen: {
    id: 'dashboard.suggestionsFilter.filterOptionOpen',
    defaultMessage: 'Open',
  },
  filterOptionAccepted: {
    id: 'dashboard.suggestionsFilter.filterOptionAccepted',
    defaultMessage: 'Accepted',
  },
  filterOptionNotPlanned: {
    id: 'dashboard.suggestionsFilter.filterOptionNotPlanned',
    defaultMessage: 'Not Planned',
  },
});

export const SuggestionsFilterOptions = {
  All: 'All',
  Open: SuggestionStatus.Open,
  Accepted: SuggestionStatus.Accepted,
  NotPlanned: SuggestionStatus.NotPlanned,
};

export type SuggestionsFilterOptionType = keyof typeof SuggestionsFilterOptions;

export const suggestionsFilterSelectOptions = [
  {
    label: SUGGESTIONS_FILTER_MSG.filterOptionAll,
    value: SuggestionsFilterOptions.All,
  },
  {
    label: SUGGESTIONS_FILTER_MSG.filterOptionOpen,
    value: SuggestionsFilterOptions.Open,
  },
  {
    label: SUGGESTIONS_FILTER_MSG.filterOptionAccepted,
    value: SuggestionsFilterOptions.Accepted,
  },
  {
    label: SUGGESTIONS_FILTER_MSG.filterOptionNotPlanned,
    value: SuggestionsFilterOptions.NotPlanned,
  },
];

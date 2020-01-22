import {
  ColonyTasksQuery,
  ColonyTasksQueryVariables,
  ColonyTasksDocument,
} from '~data/index';
import { Address } from '~types/index';
import { log } from '~utils/debug';

import apolloCache from './cache';
import {
  ColonySuggestionsQuery,
  ColonySuggestionsQueryVariables,
  ColonySuggestionsDocument,
  SetSuggestionStatusMutationResult,
} from './generated';

type Cache = typeof apolloCache;

const cacheUpdates = {
  createTask(colonyAddress: Address) {
    return (cache: Cache, { data }) => {
      try {
        const cacheData = cache.readQuery<
          ColonyTasksQuery,
          ColonyTasksQueryVariables
        >({
          query: ColonyTasksDocument,
          variables: {
            address: colonyAddress,
          },
        });
        // This is used for createTask and createTaskFromSuggestion mutations
        const createTaskData =
          data && (data.createTask || data.createTaskFromSuggestion);
        if (cacheData && createTaskData) {
          const tasks = cacheData.colony.tasks || [];
          tasks.push(createTaskData);
          cache.writeQuery<ColonyTasksQuery, ColonyTasksQueryVariables>({
            query: ColonyTasksDocument,
            data: {
              colony: {
                ...cacheData.colony,
                tasks,
              },
            },
            variables: {
              address: colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - colony tasks not loaded yet');
      }
    };
  },
  setSuggestionStatusDeleted(colonyAddress: Address) {
    return (cache: Cache, { data }: SetSuggestionStatusMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonySuggestionsQuery,
          ColonySuggestionsQueryVariables
        >({
          query: ColonySuggestionsDocument,
          variables: {
            colonyAddress,
          },
        });
        const suggestionId =
          data && data.setSuggestionStatus && data.setSuggestionStatus.id;
        if (cacheData && suggestionId) {
          const suggestions = cacheData.colony.suggestions.filter(
            ({ id }) => id !== suggestionId,
          );
          cache.writeQuery<
            ColonySuggestionsQuery,
            ColonySuggestionsQueryVariables
          >({
            query: ColonySuggestionsDocument,
            data: {
              colony: {
                ...cacheData.colony,
                suggestions,
              },
            },
            variables: {
              colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - suggestions not loaded yet');
      }
    };
  },
};

export default cacheUpdates;

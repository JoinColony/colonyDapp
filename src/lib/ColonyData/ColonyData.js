/* @flow */

import type { XtremeQuery3000 } from '~data/types';

import QueryExecution from './QueryExecution';

import { getTask } from './getTask';

/*
 * @todo Improve types for ColonyData
 */
export default class ColonyData {
  context: Object;

  queries: *;

  constructor(context: Object = {}) {
    this.context = context;
    this.queries = new Proxy(
      {
        getTask,
      },
      {
        get: (queries, name) => this.executeQuery.bind(this, queries[name]),
      },
    );
  }

  setContext(context: Object): void {
    this.context = { ...this.context, ...context };
  }

  validateContext({ context }: { context: string[] }): void {
    const missing = context.filter(contextName => !this.context[contextName]);

    if (missing.length) {
      throw new Error(`Missing context: ${missing.join(', ')}`);
    }
  }

  executeQuery(
    query: XtremeQuery3000<*, *, *, *>,
    options: { metadata: *, args: * },
  ) {
    this.validateContext(query);
    return new QueryExecution(query, this.context, options);
  }
}

/*
 * We need to add the accounts to the `global` object here, since global setup/teardown
 * does not share the actual global state with the individual test suites.
 *
 * But this does.
 */
global.ganacheAccounts = require('../../ganache-accounts.json');

const prompts = {
  module: {
    type: 'list',
    name: 'module',
    message: 'which module?',
    choices: [
      { name: 'admin', value: 'admin' },
      { name: 'core', value: 'core' },
      { name: 'dashboard', value: 'dashboard' },
      { name: 'users', value: 'users' },
      { name: 'pages', value: 'pages' },
    ],
  },
  componentName: {
    type: 'input',
    name: 'componentName',
    message: 'Component name (e.g. MyComponent)',
  },
  subComponentName: {
    type: 'input',
    name: 'subComponentName',
    message: 'Subcomponent name (e.g. SubComponent). Please just press enter for component scaffolding!',
    default: function getDefault(props) {
      return props.componentName;
    },
  },
  addTests: {
    type: 'confirm',
    name: 'addTests',
    message: 'Add test scaffold?',
    default: true,
  },
};

const actions = {
  component: (module, componentName) => ({
    type: 'add',
    path: `src/modules/${module}/components/${componentName}/${componentName}.tsx`,
    templateFile: 'plop-templates/componentTsx.hbs',
  }),
  componentIndex: (module, componentName) => ({
    type: 'add',
    path: `src/modules/${module}/components/${componentName}/index.ts`,
    templateFile: 'plop-templates/componentIndex.hbs',
  }),
  componentContainer: (module, componentName) => ({
    type: 'add',
    path: `src/modules/${module}/components/${componentName}/${componentName}.ts`,
    templateFile: 'plop-templates/componentContainer.hbs',
  }),
  componentStyles: (module, componentName) => ({
    type: 'add',
    path: `src/modules/${module}/components/${componentName}/${componentName}.css`,
    templateFile: 'plop-templates/componentStyles.hbs',
  }),
  componentTest: (module, componentName, subComponentName) => ({
    type: 'add',
    path: `src/modules/${module}/components/${componentName}/__tests__/${subComponentName}.test.ts`,
    templateFile: 'plop-templates/componentTests.hbs',
  }),
};

module.exports = function createPlopConfig(plop) {
  plop.setGenerator('component scaffold', {
    description: 'add scaffold for a react component',
    prompts: [
      prompts.module,
      prompts.componentName,
      prompts.subComponentName, // Has to be the same as the componentName. For the tests
      prompts.addTests,
    ],
    actions: (data) => {
      const generatorActions = [
        actions.component('{{module}}', '{{componentName}}'),
        actions.componentIndex('{{module}}', '{{componentName}}'),
        actions.componentContainer('{{module}}', '{{componentName}}'),
        actions.componentStyles('{{module}}', '{{componentName}}'),
      ];
      if (data.addTests) {
        generatorActions.push(actions.componentTest('{{module}}', '{{componentName}}', '{{subComponentName}}'));
      }
      return generatorActions;
    },
  });
  plop.setGenerator('component tests', {
    description: 'add test scaffold for a react component',
    prompts: [
      prompts.module,
      prompts.componentName,
      prompts.subComponentName,
    ],
    actions: [
      actions.componentTest('{{module}}', '{{componentName}}', '{{subComponentName}}'),
    ],
  });
};

/* eslint-disable security/detect-non-literal-fs-filename */
const test = require('ava');
const { EventDispatcher } = require('uttori-utilities');
const StorageProviderJSONMemory = require('../src/plugin.js');

test('StorageProviderJSONMemory.register(context): can register', (t) => {
  t.notThrows(() => {
    StorageProviderJSONMemory.register({ hooks: { on: () => {} }, config: { [StorageProviderJSONMemory.configKey]: { events: { callback: [] } } } });
  });
});

test('StorageProviderJSONMemory.register(context): errors without event dispatcher', (t) => {
  t.throws(() => {
    StorageProviderJSONMemory.register({ hooks: {} });
  }, { message: 'Missing event dispatcher in \'context.hooks.on(event, callback)\' format.' });
});

test('StorageProviderJSONMemory.register(context): errors without events', (t) => {
  t.throws(() => {
    StorageProviderJSONMemory.register({ hooks: { on: () => {} }, config: { [StorageProviderJSONMemory.configKey]: { events: undefined } } });
  }, { message: 'Missing events to listen to for in \'config.events\'.' });
});

test('StorageProviderJSONMemory.defaultConfig(): can return a default config', (t) => {
  t.notThrows(StorageProviderJSONMemory.defaultConfig);
});

test('StorageProviderJSONMemory.get(viewModel, context): can return a document', async (t) => {
  t.plan(1);
  const document = {
    updateDate: new Date('2020-04-20').toISOString(),
    createDate: new Date('2020-04-20').toISOString(),
    customData: undefined,
    slug: 'test',
    tags: ['cool', 'blue'],
  };

  const hooks = new EventDispatcher();
  const context = {
    hooks,
    config: {
      [StorageProviderJSONMemory.configKey]: {
        events: {
          add: ['storage-add'],
          get: ['storage-get'],
        },
      },
    },
  };
  StorageProviderJSONMemory.register(context);

  await context.hooks.dispatch('storage-add', document);
  const output = await context.hooks.filter('storage-get', document.slug);
  t.deepEqual(output, document);
});

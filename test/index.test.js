// @ts-nocheck
const test = require('ava');
const { Plugin, StorageProvider } = require('../src');

test('Plugin: is properly exported', (t) => {
  t.notThrows(() => {
    Plugin.defaultConfig();
  });
});

test('StorageProvider: is properly exported', (t) => {
  t.notThrows(() => {
    const storage = new StorageProvider();
    storage.reset();
  });
});

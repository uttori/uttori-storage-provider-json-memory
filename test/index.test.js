// @ts-nocheck
import test from 'ava';
import { Plugin, StorageProvider } from '../src/index.js';

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

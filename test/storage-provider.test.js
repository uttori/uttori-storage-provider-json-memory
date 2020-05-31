/* eslint-disable unicorn/no-useless-undefined */
const test = require('ava');
const Document = require('uttori-document');
const StorageProvider = require('../src/storage-provider.js');

const example = {
  title: 'Example Title',
  slug: 'example-title',
  content: '## Example Title',
  html: '',
  updateDate: 1459310452001,
  createDate: 1459310452001,
  tags: ['Example Tag'],
  customData: {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  },
};

const empty = {
  title: 'empty',
  slug: 'empty',
  content: 'empty',
  html: '',
  updateDate: 1459310452003,
  createDate: 1459310452003,
  tags: ['Fake'],
  customData: {},
};

const fake = {
  title: 'Fake',
  slug: 'fake',
  content: '# Fake',
  html: '',
  updateDate: 1459310452002,
  createDate: 1459310452002,
  tags: ['Example Tag', 'Fake'],
  customData: {},
};

test('constructor(): does not error', (t) => {
  t.notThrows(() => new StorageProvider());
});

test('all(): returns all the documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const results = s.all();
  t.deepEqual(results, [example]);
});

test('tags(): returns all unique tags from all the documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);
  const results = s.tags();
  t.deepEqual(results, ['Example Tag', 'Fake']);
});

test('getTaggedDocuments(tag, limit, fields): returns documents with the given tag', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);

  let tag = 'Example Tag';
  let query = `SELECT 'slug', 'title', 'tags', 'updateDate' FROM documents WHERE 'tags' INCLUDES ('${tag}') ORDER BY title ASC LIMIT 100`;
  let output = s.getQuery(query);
  t.deepEqual(output, [example, fake]);

  tag = 'Fake';
  query = `SELECT 'slug', 'title', 'tags', 'updateDate' FROM documents WHERE 'tags' INCLUDES ('${tag}') ORDER BY title ASC LIMIT 100`;
  output = s.getQuery(query);
  t.deepEqual(output, [fake, empty]);

  tag = 'No Tag';
  query = `SELECT 'slug', 'title', 'tags', 'updateDate' FROM documents WHERE 'tags' INCLUDES ('${tag}') ORDER BY title ASC LIMIT 100`;
  output = s.getQuery(query);
  t.deepEqual(output, []);
});

test('getRecentDocuments(limit, fields): returns the requested number of the most recently updated documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);

  let limit = 1;
  let query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY updateDate DESC LIMIT ${limit}`;
  let output = s.getQuery(query);
  t.deepEqual(output, [empty]);

  limit = 2;
  query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY updateDate DESC LIMIT ${limit}`;
  output = s.getQuery(query);
  t.deepEqual(output, [empty, fake]);

  limit = 3;
  query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY updateDate DESC LIMIT ${limit}`;
  output = s.getQuery(query);
  t.deepEqual(output, [empty, fake, example]);
});

test('getRelatedDocuments(document, limit, fields): returns the requested number of the related documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  const tagged = { ...empty, tags: ['Example Tag'] };
  s.add(tagged);

  const query = `SELECT * FROM documents WHERE 'tags' INCLUDES ('${example.tags.join(',')}') AND slug != ${example.slug} ORDER BY title DESC LIMIT 2`;
  const output = s.getQuery(query);
  t.deepEqual(output, [tagged, fake]);
});

test('getRandomDocuments(limit, fields): returns the requested number of random documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);

  let limit = 1;
  let query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY RANDOM LIMIT ${limit}`;
  let output = s.getQuery(query);
  t.is(output.length, 1);

  limit = 2;
  query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY RANDOM LIMIT ${limit}`;
  output = s.getQuery(query);
  t.is(output.length, 2);

  limit = 3;
  query = `SELECT * FROM documents WHERE 'slug' != '' ORDER BY RANDOM LIMIT ${limit}`;
  output = s.getQuery(query);
  t.is(output.length, 3);
});

test('get(slug): returns the matching document', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const results = s.get(example.slug);
  t.deepEqual(results, example);
});

test('get(slug): returns undefined when there is no slug', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const results = s.get(undefined);
  t.is(results, undefined);
});

test('get(slug): returns undefined when no document is found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = s.get('missing-file');
  t.is(document, undefined);
});

test('getHistory(slug): returns undefined when missing a slug', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const history = s.getHistory('');
  t.is(history, undefined);
});

test('getHistory(slug): returns an empty array when a slug is not found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  t.is(s.getHistory(''), undefined);
  t.deepEqual(s.getHistory('missing'), []);
});

test('getHistory(slug): returns an array of the history revisions', (t) => {
  let all;
  let history;

  const s = new StorageProvider();
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = { test: true };
  document.html = '';
  document.slug = 'second-file';
  document.tags = ['test'];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file');
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = 'second file-v2';
  document.content = 'second file-v2';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v2');
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = 'second file-v3';
  document.content = 'second file-v3';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v3');
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = 'second-file-new-directory';
  document.title = 'second file-v4';
  document.content = 'second file-v4';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v4');
  history = s.getHistory(document.slug);
  t.is(history.length, 4);
});

test('getRevision({ slug, revision }): returns undefined when missing a slug', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const revision = s.getRevision({ slug: undefined, revision: undefined });
  t.is(revision, undefined);
});

test('getRevision({ slug, revision }): returns undefined when missing a revision', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const revision = s.getRevision({ slug: 'slug', revision: '' });
  t.is(revision, undefined);
});

test('getRevision({ slug, revision }): returns undefined when no revision is found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const revision = s.getRevision({ slug: 'slug', revision: 'missing' });
  t.is(revision, undefined);
});

test('getRevision({ slug, revision }): returns a specific revision of an article', (t) => {
  let all;
  let history;

  const s = new StorageProvider();
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = { test: true };
  document.html = '';
  document.slug = 'second-file';
  document.tags = ['test'];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file');
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = 'second file-v2';
  document.content = 'second file-v2';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v2');
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = 'second file-v3';
  document.content = 'second file-v3';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v3');
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = 'second-file-new-directory';
  document.title = 'second file-v4';
  document.content = 'second file-v4';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, 'second file-v4');
  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  let revision;
  revision = s.getRevision({ slug: document.slug, revision: history[0] });
  t.is(revision.title, 'second file');
  revision = s.getRevision({ slug: document.slug, revision: history[1] });
  t.is(revision.title, 'second file-v2');
  revision = s.getRevision({ slug: document.slug, revision: history[2] });
  t.is(revision.title, 'second file-v3');
  revision = s.getRevision({ slug: document.slug, revision: history[3] });
  t.is(revision.title, 'second file-v4');
});

test('add(document): cannot add without a document or a slug', (t) => {
  let all;
  const s = new StorageProvider();
  s.add();
  all = s.all();
  t.is(all.length, 0);
  s.add({});
  all = s.all();
  t.is(all.length, 0);
});

test('add(document): creates a new document', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = {};
  document.html = '';
  document.slug = 'second-file';
  document.tags = [];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  const all = s.all();
  t.deepEqual(all[0], example);
  t.is(all[1].slug, document.slug);
});

test('add(document): creates a new document with missing fields', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.html = '';
  document.slug = 'second-file';
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  const all = s.all();
  t.deepEqual(all[0], example);
  t.is(all[1].slug, document.slug);
});

test('add(document): does not create a document with the same slug', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = {};
  document.html = '';
  document.slug = 'second-file';
  document.tags = [];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.deepEqual(all[0], example);
  t.is(all[1].slug, document.slug);
  t.is(all.length, 2);
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
});

test('update(document, originalSlug): does not update without a document or slug', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);

  s.update({ document: undefined, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, example.title);

  s.update({ document: { title: 'New' }, slug: undefined, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 1);
  t.is(all[0].title, example.title);
});

test('update(document, originalSlug): updates the document', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = { test: true };
  document.html = '';
  document.slug = 'second-file';
  document.tags = ['test'];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  document.title = 'second file-v2';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, document.title);
});

test('update(document, originalSlug): renames the history if it exists', (t) => {
  let all;
  let history;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = { test: true };
  document.html = '';
  document.slug = 'second-file';
  document.tags = ['test'];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = 'second file-v2';
  document.content = 'second file-v2';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = 'second file-v3';
  document.content = 'second file-v3';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = 'second-file-new-directory';
  document.title = 'second file-v4';
  document.content = 'second file-v4';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  t.is(s.history['second-file-new-directory'].length, 4);
  t.is(s.history['second-file'], undefined);
});

test('update(document, originalSlug): updates the document with missing fields', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.html = '';
  document.slug = 'second-file';
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  document.title = 'second file-v2';
  s.update({ document, originalSlug: 'second-file' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, document.title);
});

test('update(document, originalSlug): does not update when the document exists', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.html = '';
  document.slug = 'second-file';
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  document.title = 'second file-v2';
  s.update({ document, originalSlug: 'example-title' });
  all = s.all();
  t.is(all.length, 2);
  t.is(all[1].title, 'second file');
});

test('update(document, originalSlug): adds a document if the one to update is no found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = 1;
  document.customData = {};
  document.html = '';
  document.slug = 'third-file';
  document.tags = [];
  document.title = 'third file';
  document.updateDate = 1;
  s.update({ document, originalSlug: '' });
  const all = s.all();
  t.is(all.length, 2);
});

test('delete(document): removes the document', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = 1;
  document.customData = {};
  document.html = '';
  document.slug = 'second-file';
  document.tags = [];
  document.title = 'second file';
  document.updateDate = 1;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  s.delete(document.slug);
  all = s.all();
  t.is(all.length, 1);
});

test('delete(document): does nothing when no document is found', (t) => {
  let all;
  const s = new StorageProvider();
  s.add(example);
  const document = new Document();
  document.content = '';
  document.createDate = undefined;
  document.customData = {};
  document.html = '';
  document.slug = 'second-file';
  document.tags = [];
  document.title = 'second file';
  document.updateDate = undefined;
  s.add(document);
  all = s.all();
  t.is(all.length, 2);
  s.delete('slug');
  all = s.all();
  t.is(all.length, 2);
});

test('reset(document, originalSlug): returns to initial state', (t) => {
  const s = new StorageProvider();
  s.add(example);
  t.is(s.all().length, 1);
  s.reset();
  t.is(s.all().length, 0);
});

test('augmentDocuments(documents, _fields): returns all matching documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);

  const search_results = [{ slug: 'example-title' }, { slug: 'fake' }];
  const includes = search_results.map((result) => `'${result.slug}'`).join(',');
  const query = `SELECT * FROM documents WHERE slug INCLUDES (${includes}) ORDER BY title ASC LIMIT 100`;
  const output = s.getQuery(query);
  t.deepEqual(output, [example, fake]);
});

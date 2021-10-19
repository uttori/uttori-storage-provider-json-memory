// @ts-nocheck
const test = require('ava');
const R = require('ramda');
const StorageProvider = require('../src/storage-provider');

const tagExample = 'Example Tag';
const tagFake = 'Fake';
const exampleSlug = 'example-title';
const secondFile = 'second-file';
const secondFileNewDirectory = 'second-file-new-directory';
const secondFileV1 = 'second file';
const secondFileV2 = 'second file-v2';
const secondFileV3 = 'second file-v3';
const secondFileV4 = 'second file-v4';

const example = {
  title: 'Example Title',
  slug: exampleSlug,
  content: '## Example Title',
  html: '',
  updateDate: 1459310452001,
  createDate: 1459310452001,
  tags: [tagExample],
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
  tags: [tagFake],
  customData: {},
};

const fake = {
  title: tagFake,
  slug: 'fake',
  content: '# Fake',
  html: '',
  updateDate: 1459310452002,
  createDate: 1459310452002,
  tags: [tagExample, tagFake],
  customData: {},
};

test('constructor(): does not error', (t) => {
  t.notThrows(() => new StorageProvider());
});

test('all(): returns all the documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  t.deepEqual(s.all(), { [exampleSlug]: example });
});

test('getQuery(query): returns the requested number of the most recently updated documents', (t) => {
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

test('getQuery(query): returns the requested number of the related documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  const tagged = { ...empty, tags: [tagExample] };
  s.add(tagged);

  const query = `SELECT * FROM documents WHERE 'tags' INCLUDES ('${example.tags.join(',')}') AND slug != ${example.slug} ORDER BY title DESC LIMIT 2`;
  const output = s.getQuery(query);
  t.deepEqual(output, [tagged, fake]);
});

test('getQuery(query): returns the requested number of random documents', (t) => {
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

test('getQuery(query): returns all unique tags from all the documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);
  const results = s.getQuery('SELECT tags FROM documents WHERE slug IS_NOT_NULL ORDER BY slug ASC LIMIT 3');
  t.deepEqual(results, [
    {
      tags: [
        tagFake,
      ],
    },
    {
      tags: [
        tagExample,
      ],
    },
    {
      tags: [
        tagExample,
        tagFake,
      ],
    },
  ]);

  const tags = R.pipe(
    R.pluck('tags'),
    R.flatten,
    R.uniq,
    R.filter(Boolean),
    R.sort((a, b) => a.localeCompare(b)),
  )(results);
  t.deepEqual(tags, [tagExample, tagFake]);
});

test('getQuery(query): returns all unique tags and slug from all the documents', (t) => {
  const s = new StorageProvider();
  s.add(example);
  s.add(fake);
  s.add(empty);
  const results = s.getQuery('SELECT slug, tags FROM documents WHERE slug IS_NOT_NULL ORDER BY slug ASC LIMIT 3');
  t.deepEqual(results, [
    {
      slug: 'empty',
      tags: [
        tagFake,
      ],
    },
    {
      slug: exampleSlug,
      tags: [
        tagExample,
      ],
    },
    {
      slug: 'fake',
      tags: [
        tagExample,
        tagFake,
      ],
    },
  ]);

  const tags = R.pipe(
    R.pluck('tags'),
    R.flatten,
    R.uniq,
    R.filter(Boolean),
    R.sort((a, b) => a.localeCompare(b)),
  )(results);
  t.deepEqual(tags, [tagExample, tagFake]);
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
  const results = s.get();
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
  let history;
  const s = new StorageProvider();
  const document = {
    content: '',
    createDate: undefined,
    customData: { test: true },
    html: '',
    slug: secondFile,
    tags: ['test'],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV1);
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = secondFileV2;
  document.content = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV2);
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = secondFileV3;
  document.content = secondFileV3;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV3);
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = secondFileNewDirectory;
  document.title = secondFileV4;
  document.content = secondFileV4;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV4);
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
  let history;
  const s = new StorageProvider();
  const document = {
    content: '',
    createDate: undefined,
    customData: { test: true },
    html: '',
    slug: secondFile,
    tags: ['test'],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV1);
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = secondFileV2;
  document.content = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV2);
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = secondFileV3;
  document.content = secondFileV3;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV3);
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = secondFileNewDirectory;
  document.title = secondFileV4;
  document.content = secondFileV4;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, secondFileV4);
  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  let revision;
  revision = s.getRevision({ slug: document.slug, revision: history[0] });
  t.is(revision.title, secondFileV1);
  revision = s.getRevision({ slug: document.slug, revision: history[1] });
  t.is(revision.title, secondFileV2);
  revision = s.getRevision({ slug: document.slug, revision: history[2] });
  t.is(revision.title, secondFileV3);
  revision = s.getRevision({ slug: document.slug, revision: history[3] });
  t.is(revision.title, secondFileV4);
});

test('add(document): cannot add without a document or a slug', (t) => {
  const s = new StorageProvider();
  s.add();
  t.is(Object.values(s.all()).length, 0);
  s.add({});
  t.is(Object.values(s.all()).length, 0);
});

test('add(document): creates a new document', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: {},
    html: '',
    slug: secondFile,
    tags: [],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.deepEqual(Object.values(s.all())[0], example);
  t.is(Object.values(s.all())[1].slug, document.slug);
});

test('add(document): creates a new document with missing fields', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    html: '',
    slug: secondFile,
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.deepEqual(Object.values(s.all())[0], example);
  t.is(Object.values(s.all())[1].slug, document.slug);
});

test('add(document): does not create a document with the same slug', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: {},
    html: '',
    slug: secondFile,
    tags: [],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.deepEqual(Object.values(s.all())[0], example);
  t.is(Object.values(s.all())[1].slug, document.slug);
  t.is(Object.values(s.all()).length, 2);
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
});

test('update(document, originalSlug): does not update without a document or slug', (t) => {
  const s = new StorageProvider();
  s.add(example);

  s.update({ document: undefined, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, example.title);

  s.update({ document: { title: 'New' }, slug: undefined, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 1);
  t.is(Object.values(s.all())[0].title, example.title);
});

test('update(document, originalSlug): updates the document', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: { test: true },
    html: '',
    slug: secondFile,
    tags: ['test'],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  document.title = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
});

test('update(document, originalSlug): updates the document without timestamps or history', (t) => {
  const s = new StorageProvider({ use_history: false, update_timestamps: false });
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: { test: true },
    html: '',
    slug: secondFile,
    tags: ['test'],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  document.title = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
});

test('update(document, originalSlug): renames the history if it exists', (t) => {
  let history;
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: { test: true },
    html: '',
    slug: secondFile,
    tags: ['test'],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  history = s.getHistory(document.slug);
  t.is(history.length, 1);

  document.title = secondFileV2;
  document.content = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 2);

  document.title = secondFileV3;
  document.content = secondFileV3;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 3);

  document.slug = secondFileNewDirectory;
  document.title = secondFileV4;
  document.content = secondFileV4;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
  history = s.getHistory(document.slug);
  t.is(history.length, 4);

  t.is(s.history[secondFileNewDirectory].length, 4);
  t.is(s.history[secondFile], undefined);
});

test('update(document, originalSlug): updates the document with missing fields', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    html: '',
    slug: secondFile,
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  document.title = secondFileV2;
  s.update({ document, originalSlug: secondFile });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
});

test('update(document, originalSlug): updates the document with missing fields when no originalSlug is provided', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    html: '',
    slug: secondFile,
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  document.title = secondFileV2;
  s.update({ document, originalSlug: undefined });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, document.title);
});

test('update(document, originalSlug): does not update when the document exists', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    html: '',
    slug: secondFile,
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.values(s.all()).length, 2);
  document.title = secondFileV2;
  s.update({ document, originalSlug: exampleSlug });
  t.is(Object.values(s.all()).length, 2);
  t.is(Object.values(s.all())[1].title, secondFileV1);
});

test('update(document, originalSlug): adds a document if the document to update is not found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: 1,
    customData: {},
    html: '',
    slug: 'third-file',
    tags: [],
    title: 'third file',
    updateDate: 1,
  };
  s.update({ document, originalSlug: '' });
  t.is(Object.keys(s.all()).length, 2);
});

test('delete(document): removes the document', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: 1,
    customData: {},
    html: '',
    slug: secondFile,
    tags: [],
    title: secondFileV1,
    updateDate: 1,
  };
  s.add(document);
  t.is(Object.keys(s.all()).length, 2);
  s.delete(document.slug);
  t.is(Object.keys(s.all()).length, 1);
});

test('delete(document): removes the document without history', (t) => {
  const s = new StorageProvider({ use_history: false });
  s.add(example);
  const document = {
    content: '',
    createDate: 1,
    customData: {},
    html: '',
    slug: secondFile,
    tags: [],
    title: secondFileV1,
    updateDate: 1,
  };
  s.add(document);
  t.is(Object.keys(s.all()).length, 2);
  s.delete(document.slug);
  t.is(Object.keys(s.all()).length, 1);
});

test('delete(document): does nothing when no document is found', (t) => {
  const s = new StorageProvider();
  s.add(example);
  const document = {
    content: '',
    createDate: undefined,
    customData: {},
    html: '',
    slug: secondFile,
    tags: [],
    title: secondFileV1,
    updateDate: undefined,
  };
  s.add(document);
  t.is(Object.keys(s.all()).length, 2);
  s.delete('slug');
  t.is(Object.keys(s.all()).length, 2);
});

test('reset(document, originalSlug): returns to initial state', (t) => {
  const s = new StorageProvider();
  s.add(example);
  t.is(Object.keys(s.all()).length, 1);
  s.reset();
  t.is(Object.keys(s.all()).length, 0);
});

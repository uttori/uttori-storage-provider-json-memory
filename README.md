[![view on npm](http://img.shields.io/npm/v/@uttori/storage-provider-json-memory.svg)](https://www.npmjs.org/package/@uttori/storage-provider-json-memory)
[![npm module downloads](http://img.shields.io/npm/dt/@uttori/storage-provider-json-memory.svg)](https://www.npmjs.org/package/@uttori/storage-provider-json-memory)
[![Build Status](https://travis-ci.org/uttori/uttori-storage-provider-json-memory.svg?branch=master)](https://travis-ci.org/uttori/uttori-storage-provider-json-memory)
[![Dependency Status](https://david-dm.org/uttori/uttori-storage-provider-json-memory.svg)](https://david-dm.org/uttori/uttori-storage-provider-json-memory)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-storage-provider-json-memory/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-storage-provider-json-memory?branch=master)

# Uttori Storage Provider - JSON Memory

Uttori Storage Provider using JavaScript objects in memory. This does NOT persist or restore data.

This repo exports both a Uttori Plugin compliant `Plugin` class as well as the underlying `StorageProvider` class.

## Install

```bash
npm install --save @uttori/storage-provider-json-memory
```

# Config

```js
{
  // Registration Events
  events: {
    add: ['storage-add'],
    delete: ['storage-delete'],
    get: ['storage-get'],
    getHistory: ['storage-get-history'],
    getRevision: ['storage-get-revision'],
    getQuery: ['storage-query'],
    update: ['storage-update'],
    validateConfig: ['validate-config'],
  },
}
```

* * *

# Example

```js
const { StorageProvider } = require('@uttori/storage-provider-json-memory');
const s = new StorageProvider();
s.add({
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
});
const results = s.getQuery('SELECT tags FROM documents WHERE slug IS_NOT_NULL ORDER BY slug ASC LIMIT 1');
➜  results === [
      { tags: ['Example Tag'] },
    ]
```

# API Reference

## Classes

<dl>
<dt><a href="#StorageProvider">StorageProvider</a></dt>
<dd><p>Storage for Uttori documents using JSON objects in memory.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#UttoriDocument">UttoriDocument</a></dt>
<dd></dd>
</dl>

<a name="StorageProvider"></a>

## StorageProvider
Storage for Uttori documents using JSON objects in memory.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| documents | [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) | The collection of documents. |
| history | <code>object</code> | The collection of document histories indexes. |
| histories | <code>object</code> | The collection of document revisions by index. |


* [StorageProvider](#StorageProvider)
    * [new StorageProvider()](#new_StorageProvider_new)
    * [.all()](#StorageProvider+all) ⇒ <code>Array</code>
    * [.getQuery(query)](#StorageProvider+getQuery) ⇒ <code>Array</code>
    * [.get(slug)](#StorageProvider+get) ⇒ [<code>UttoriDocument</code>](#UttoriDocument)
    * [.getHistory(slug)](#StorageProvider+getHistory) ⇒ <code>object</code>
    * [.getRevision(params)](#StorageProvider+getRevision) ⇒ [<code>UttoriDocument</code>](#UttoriDocument)
    * [.add(document)](#StorageProvider+add)
    * [.updateValid(params)](#StorageProvider+updateValid) ℗
    * [.update(params)](#StorageProvider+update)
    * [.delete(slug)](#StorageProvider+delete)
    * [.reset()](#StorageProvider+reset)
    * [.updateHistory(params)](#StorageProvider+updateHistory)

<a name="new_StorageProvider_new"></a>

### new StorageProvider()
Creates an instance of StorageProvider.

**Example** *(Init StorageProvider)*  
```js
const storageProvider = new StorageProvider();
```
<a name="StorageProvider+all"></a>

### storageProvider.all() ⇒ <code>Array</code>
Returns all documents.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Array</code> - All documents.  
**Example**  
```js
storageProvider.all();
➜ [{ slug: 'first-document', ... }, ...]
```
<a name="StorageProvider+getQuery"></a>

### storageProvider.getQuery(query) ⇒ <code>Array</code>
Returns all documents matching a given query.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Array</code> - The items matching the supplied query.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The conditions on which documents should be returned. |

<a name="StorageProvider+get"></a>

### storageProvider.get(slug) ⇒ [<code>UttoriDocument</code>](#UttoriDocument)
Returns a document for a given slug.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: [<code>UttoriDocument</code>](#UttoriDocument) - The returned UttoriDocument.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The slug of the document to be returned. |

<a name="StorageProvider+getHistory"></a>

### storageProvider.getHistory(slug) ⇒ <code>object</code>
Returns the history of edits for a given slug.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>object</code> - The returned history object.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The slug of the document to get history for. |

<a name="StorageProvider+getRevision"></a>

### storageProvider.getRevision(params) ⇒ [<code>UttoriDocument</code>](#UttoriDocument)
Returns a specifc revision from the history of edits for a given slug and revision timestamp.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: [<code>UttoriDocument</code>](#UttoriDocument) - The returned revision of the document.  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params object. |
| params.slug | <code>string</code> | The slug of the document to be returned. |
| params.revision | <code>string</code> \| <code>number</code> | The unix timestamp of the history to be returned. |

<a name="StorageProvider+add"></a>

### storageProvider.add(document)
Saves a document to internal array.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be added to the collection. |

<a name="StorageProvider+updateValid"></a>

### storageProvider.updateValid(params) ℗
Updates a document and saves to memory.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params object. |
| params.document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be updated in the collection. |
| params.originalSlug | <code>string</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="StorageProvider+update"></a>

### storageProvider.update(params)
Updates a document and figures out how to save to memory.
Calling with a new document will add that document.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params object. |
| params.document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be updated in the collection. |
| params.originalSlug | <code>string</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="StorageProvider+delete"></a>

### storageProvider.delete(slug)
Removes a document from memory.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The slug identifying the document. |

<a name="StorageProvider+reset"></a>

### storageProvider.reset()
Resets to the initial state.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
<a name="StorageProvider+updateHistory"></a>

### storageProvider.updateHistory(params)
Updates History for a given slug, renaming the key and history key as needed.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The params object. |
| params.slug | <code>string</code> | The slug of the document to update history for. |
| params.content | [<code>UttoriDocument</code>](#UttoriDocument) | The revision of the document to be saved. |
| [params.originalSlug] | <code>string</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="UttoriDocument"></a>

## UttoriDocument
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| slug | <code>string</code> |  | The unique identifier for the document. |
| [title] | <code>string</code> | <code>&quot;&#x27;&#x27;&quot;</code> | The unique identifier for the document. |
| [createDate] | <code>number</code> \| <code>Date</code> |  | The creation date of the document. |
| [updateDate] | <code>number</code> \| <code>Date</code> |  | The last date the document was updated. |
| [tags] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | The unique identifier for the document. |
| [customData] | <code>object</code> | <code>{}</code> | Any extra meta data for the document. |


* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Misc.

You can see the various speeds of the array shuffles used for RANDOM sorting on [perf.link](https://perf.link/#eyJpZCI6Ing4aXpiZDE5aWZzIiwidGl0bGUiOiJSYW5kb21pemluZyBBcnJheXMiLCJiZWZvcmUiOiJjb25zdCBkYXRhID0gWy4uLkFycmF5KDEwMDApLmtleXMoKV07IiwidGVzdHMiOlt7Im5hbWUiOiJTaW1wbGUiLCJjb2RlIjoiZGF0YS5zb3J0KCgpID0%2BIE1hdGgucmFuZG9tKCkgLSAwLjUpOyIsInJ1bnMiOlsxNjY2LDE4MzMsMjE2NiwyMTY2LDIxNjYsMjE2NiwyMDAwLDE2NjYsMjAwMCwxODMzLDIxNjYsMTgzMywyMDAwLDIxNjYsMjAwMCwyMDAwLDIwMDAsMjAwMCwxNjY2LDIwMDAsMTgzMywxODMzLDIxNjYsMjMzMywxODMzLDE4MzMsMTgzMywyMzMzLDE2NjYsMTgzMywyMDAwLDE4MzMsMjAwMCwxNjY2LDE4MzMsMTUwMCwxNTAwLDE2NjYsMTgzMywxODMzLDIwMDAsMjE2NiwxNjY2LDIxNjYsMTgzMywyMTY2LDE4MzMsMjAwMCwyMDAwLDIwMDAsMjE2NiwyMDAwLDIzMzMsMTgzMywxNjY2LDIwMDAsMjE2NiwyMTY2LDE2NjYsMjAwMCwxODMzLDIwMDAsMTY2NiwxNjY2LDIwMDAsMTY2NiwxODMzLDE2NjYsMjAwMCwxNjY2LDIxNjYsMTgzMywyMDAwLDIwMDAsMjAwMCwyMDAwLDIxNjYsMTgzMywyMDAwLDE2NjYsMTY2NiwxNjY2LDE2NjYsMTY2NiwyMTY2LDE2NjYsMTgzMywxODMzLDE4MzMsMjE2NiwyMTY2LDE2NjYsMjAwMCwyMTY2LDIxNjYsMTY2NiwyMTY2LDIxNjYsMTY2NiwxODMzXSwib3BzIjoxOTE5fSx7Im5hbWUiOiJGaXNoZXItWWF0ZXMgQWxnb3JpdGhtIChha2EgS251dGggU2h1ZmZsZSkiLCJjb2RlIjoiZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblxuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXgtLTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICBjb25zdCB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn1cblxuc2h1ZmZsZShkYXRhKTsiLCJydW5zIjpbMjUxNjYsMjUwMDAsMzE2NjYsMzk4MzMsMzI4MzMsMzA4MzMsMzc4MzMsMzkwMDAsMjgzMzMsMjk4MzMsMzU1MDAsMzI0OTksMjUwMDAsMzgwMDAsMzQ1MDAsMzk2NjYsMzk1MDAsMzMzMzMsMzAwMDAsMzk2NjYsMzUwMDAsMjg4MzMsMzA2NjYsMzI0OTksMzkwMDAsMjg4MzMsMzIzMzMsMzkzMzMsMjQ4MzMsMzY1MDAsMzI4MzMsMjg4MzMsMzYzMzMsMjkwMDAsMzg1MDAsMjM4MzMsMjYxNjYsMjUxNjYsMzIxNjYsMzUwMDAsMzQ1MDAsMzIzMzMsMjUxNjYsMzc4MzMsMzk2NjYsMzczMzMsMzA4MzMsMzUzMzMsMzk2NjYsMzMzMzMsMzM2NjYsMzkzMzMsMzEzMzMsMzQxNjYsMzgxNjYsMzE2NjYsMjk4MzMsNDA1MDAsNDAwMDAsMzQ2NjYsMzYzMzMsMzQ1MDAsMjQ4MzMsMjUxNjYsMzcwMDAsMzkzMzMsMzI4MzMsMjUwMDAsNDMwMDAsMzY1MDAsMzgwMDAsMzUxNjYsNDEwMDAsMzIwMDAsMzk1MDAsMzUxNjYsNDEwMDAsMzAzMzMsMzc4MzMsMzI0OTksMjQ4MzMsMjUxNjYsMjUwMDAsMzQ1MDAsMzkzMzMsMjUwMDAsMzQ2NjYsMzE4MzMsNDEzMzMsMzY4MzMsNDE4MzMsMzU1MDAsMjkzMzMsMzU1MDAsMjQ2NjYsMjUwMDAsMzYzMzMsMzMwMDAsMjUwMDAsMzg2NjZdLCJvcHMiOjMzNDMzfSx7Im5hbWUiOiJEdXJzdGVuZmVsZCBTaHVmZmxlIEFsZ29yaXRobSAoSW4tUGxhY2UpIiwiY29kZSI6ImZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICBsZXQgaSA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoaSAhPT0gMCkge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG4gICAgICAgIGktLTtcbiAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5zaHVmZmxlKGRhdGEpOyIsInJ1bnMiOls3NjY2LDE0MTY2LDE0MzMzLDE0MTY2LDE0MzMzLDE0MzMzLDEzODMzLDcwMDAsMTMwMDAsMTk2NjYsMTQxNjYsMTIwMDAsMTIwMDAsMTQzMzMsMTYzMzMsMTQ2NjYsMTIxNjYsMTQxNjYsMTUxNjYsMTg4MzMsMTQxNjYsMTEwMDAsMTU2NjYsMTExNjYsMTQzMzMsMTMzMzMsMTMwMDAsMTYwMDAsOTUwMCwxMjMzMywxMjY2NiwxNDE2NiwxNjAwMCwxNDE2NiwxMjgzMywxMDMzMywxMzMzLDExNjYsOTgzMywxNDE2NiwxNDE2NiwxMTY2Niw5MzMzLDE0MTY2LDE0MTY2LDE0MzMzLDEyNTAwLDg4MzMsMTQzMzMsMTYwMDAsMTc1MDAsNTY2NiwxNzMzMywxNDMzMywxNDMzMywxNDE2NiwxNDMzMywxNDE2NiwxNDE2NiwxODAwMCwxNDMzMywxNDMzMyw2MDAwLDExMDAwLDE0MTY2LDEzNTAwLDEyODMzLDgzMzMsMTQxNjYsMTE2NjYsMTQzMzMsOTY2NiwyMDgzMyw2MzMzLDEyMTY2LDE4MzMzLDk4MzMsMTE4MzMsMTMzMzMsMTIxNjYsODMzMyw3NTAwLDUwMDAsMTEzMzMsMTMxNjYsODMzMywxMjE2NiwxNDMzMywxODUwMCwxNDMzMywxNDMzMywxNDE2NiwxMjE2NiwxNDMzMywzMTY2LDg2NjYsMTQxNjYsMTc2NjYsNzY2NiwxNDE2Nl0sIm9wcyI6MTI2OTZ9XSwidXBkYXRlZCI6IjIwMjAtMDYtMTlUMTg6NDI6MzkuOTI1WiJ9)

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)

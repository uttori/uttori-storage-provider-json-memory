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
npm install --save uttori-storage-provider-json-memory
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
    query: ['storage-query'],
    update: ['storage-update'],
    validateConfig: ['validate-config'],
  },
}
```

* * *

# Example

```js
const { StorageProvider } = require('uttori-storage-provider-json-memory');
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
    * [.documents](#StorageProvider+documents) : [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
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
<a name="StorageProvider+documents"></a>

### storageProvider.documents : [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
**Kind**: instance property of [<code>StorageProvider</code>](#StorageProvider)  
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

You can see the various speeds of the array shuffles used for RANDOM sorting on [perf.link](https://perf.link/#eyJpZCI6Ing4aXpiZDE5aWZzIiwidGl0bGUiOiJGaW5kaW5nIG51bWJlcnMgaW4gYW4gYXJyYXkgb2YgMTAwMCIsImJlZm9yZSI6Ii8vIFNodWZmbGUgQXJyYXlzXG5jb25zdCBkYXRhID0gWy4uLkFycmF5KDEwMDApLmtleXMoKV07IiwidGVzdHMiOlt7Im5hbWUiOiJTaW1wbGUiLCJjb2RlIjoiZGF0YS5zb3J0KCgpID0%2BIE1hdGgucmFuZG9tKCkgLSAwLjUpOyIsInJ1bnMiOlsxODMzLDE2NjYsMjAwMCwyMDAwLDE4MzMsMTY2NiwxODMzLDE4MzMsMTgzMywyMDAwLDIxNjYsMjAwMCwxODMzLDE4MzMsMTY2NiwxNjY2LDIxNjYsMjAwMCwyMDAwLDE2NjYsMjE2NiwxODMzLDIxNjYsMTY2NiwyMDAwLDE4MzMsMTgzMywxODMzLDE2NjYsMTY2NiwxNjY2LDE4MzMsMTgzMywxODMzLDIwMDAsMTY2NiwyMDAwLDE4MzMsMTY2NiwyMDAwLDIxNjYsMjAwMCwxNjY2LDE4MzMsMjE2NiwyMTY2LDIwMDAsMTgzMywxODMzLDIzMzMsMjAwMCwyMDAwLDIwMDAsMTgzMywyMDAwLDE2NjYsMjE2NiwyMDAwLDE2NjYsMjAwMCwxODMzLDIwMDAsMjAwMCwxODMzLDIwMDAsMTY2NiwyMTY2LDEzMzMsMjE2NiwxODMzLDIwMDAsMjE2NiwyMTY2LDIwMDAsMjAwMCwyMDAwLDIxNjYsMjAwMCwxNjY2LDE4MzMsMjAwMCwyMTY2LDE4MzMsMjAwMCwyMDAwLDE4MzMsMTY2NiwyMDAwLDE2NjYsMTY2NiwxNjY2LDE2NjYsMTgzMywyMTY2LDIwMDAsMTgzMywyMDAwLDE2NjYsMjAwMCwxNjY2XSwib3BzIjoxODk5fSx7Im5hbWUiOiJGaXNoZXItWWF0ZXMgQWxnb3JpdGhtIChha2EgS251dGggU2h1ZmZsZSkiLCJjb2RlIjoiZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICBsZXQgY3VycmVudEluZGV4ID0gYXJyYXkubGVuZ3RoO1xuXG4gIC8vIFdoaWxlIHRoZXJlIHJlbWFpbiBlbGVtZW50cyB0byBzaHVmZmxlLi4uXG4gIHdoaWxlIChjdXJyZW50SW5kZXggIT09IDApIHtcblxuICAgIC8vIFBpY2sgYSByZW1haW5pbmcgZWxlbWVudC4uLlxuICAgIGNvbnN0IHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICBjdXJyZW50SW5kZXgtLTtcblxuICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICBjb25zdCB0ZW1wb3JhcnlWYWx1ZSA9IGFycmF5W2N1cnJlbnRJbmRleF07XG4gICAgYXJyYXlbY3VycmVudEluZGV4XSA9IGFycmF5W3JhbmRvbUluZGV4XTtcbiAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheTtcbn1cblxuc2h1ZmZsZShkYXRhKTsiLCJydW5zIjpbMzY1MDAsMjk1MDAsMzg4MzMsMzAwMDAsMzI0OTksMjg4MzMsMjk2NjYsMjQ4MzMsMTgxNjYsMjk4MzMsNDIxNjYsMzc4MzMsMzExNjYsMzI4MzMsMjQ4MzMsMzA2NjYsMzg1MDAsMzc4MzMsMzAxNjYsMzgzMzMsMzQ4MzMsNDA1MDAsMzkxNjYsMzEwMDAsMzgwMDAsMzUwMDAsMzA2NjYsMTQxNjYsMzU2NjYsMjY2NjYsMjM2NjYsMzc4MzMsMzk4MzMsMzMwMDAsMjQ4MzMsMjkxNjYsMzQxNjYsMjUwMDAsMzIxNjYsMzExNjYsMzA4MzMsMzUxNjYsMTY4MzMsMzgwMDAsMzU1MDAsMzEwMDAsMzc4MzMsMjkxNjYsMzY4MzMsNDMxNjYsMzMxNjYsMzc2NjYsNDIwMDAsMTc4MzMsMzcxNjYsMjk1MDAsMzg4MzMsMzc2NjYsMzI4MzMsMzY4MzMsMzgzMzMsMzE4MzMsMzg2NjYsMzMwMDAsMjk1MDAsMzM2NjYsMzIxNjYsMTY1MDAsMzA2NjYsMzYzMzMsMzEzMzMsMzkzMzMsMzI2NjYsMzA2NjYsNDEzMzMsMjQ4MzMsMzYzMzMsMzAxNjYsMzk1MDAsMzkzMzMsMzAxNjYsNDE1MDAsMzEzMzMsMjkzMzMsMjc2NjYsMjUwMDAsMjQ4MzMsMzgzMzMsMjkxNjYsMzgzMzMsMzk1MDAsMzEzMzMsMzc1MDAsNDAzMzMsMzUwMDAsMzgxNjYsMzY4MzMsMzY2NjYsMjQ4MzMsMzA1MDBdLCJvcHMiOjMyODk3fSx7Im5hbWUiOiJEdXJzdGVuZmVsZCBTaHVmZmxlIEFsZ29yaXRobSAoSW4tUGxhY2UpIiwiY29kZSI6ImZ1bmN0aW9uIHNodWZmbGUoYXJyYXkpIHtcbiAgICBsZXQgaSA9IGFycmF5Lmxlbmd0aDtcbiAgICB3aGlsZSAoaSAhPT0gMCkge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSk7XG4gICAgICAgIGktLTtcbiAgICAgICAgW2FycmF5W2ldLCBhcnJheVtqXV0gPSBbYXJyYXlbal0sIGFycmF5W2ldXTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuXG5zaHVmZmxlKGRhdGEpOyIsInJ1bnMiOlsxMjAwMCwxMTMzMywxOTE2NiwxNDMzMywxNDE2NiwxMzMzMywxMTE2Niw2NjY2LDEzMzMsMTE2NjYsMTQzMzMsMTUwMCwxNDE2NiwxMzE2NiwxMDMzMywxMzUwMCwxMDgzMywxODUwMCwxOTMzMyw4NTAwLDEyNjY2LDE4MDAwLDIwMDAwLDE0ODMzLDE0MzMzLDE2NjY2LDEwODMzLDExNjY2LDEzMTY2LDg4MzMsMTMzMzMsMTQxNjYsMTQxNjYsMTMwMDAsODAwMCwxMjE2NiwxNDE2NiwxMTAwMCwxNDE2NiwxMjAwMCwxMTY2NiwxNjUwMCwxMzMzLDEzMTY2LDE0MzMzLDIyMTY2LDE0MzMzLDg4MzMsMTQzMzMsMTQzMzMsMzY2NiwxMzMzMywyMDMzMywxMzMzLDIwNjY2LDE0MTY2LDEwNTAwLDEzNTAwLDEwMzMzLDE0MzMzLDE0MzMzLDE0NjY2LDUwMDAsMTMxNjYsMTQxNjYsOTY2NiwxNTgzMywzNjY2LDIwNjY2LDg1MDAsMTQxNjYsMjEzMzMsMTQxNjYsMTM2NjYsMTg1MDAsNzUwMCwxODAwMCwxMjgzMywxMzMzLDE0MzMzLDEzMDAwLDE5ODMzLDE0MTY2LDE0MDAwLDExNjY2LDExNTAwLDEwMTY2LDE0MzMzLDk4MzMsMTQxNjYsMTQzMzMsMTQzMzMsMTE1MDAsMTk4MzMsMTQzMzMsMTQzMzMsMTkzMzMsNTUwMCw4NjY2LDExNjZdLCJvcHMiOjEyNzExfV0sInVwZGF0ZWQiOiIyMDIwLTA1LTMxVDE5OjI3OjMxLjU3M1oifQ%3D%3D);

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)

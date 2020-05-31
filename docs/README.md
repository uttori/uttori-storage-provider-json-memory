[![view on npm](http://img.shields.io/npm/v/uttori-storage-provider-json-memory.svg)](https://www.npmjs.org/package/uttori-storage-provider-json-memory)
[![npm module downloads](http://img.shields.io/npm/dt/uttori-storage-provider-json-memory.svg)](https://www.npmjs.org/package/uttori-storage-provider-json-memory)
[![Build Status](https://travis-ci.org/uttori/uttori-storage-provider-json-memory.svg?branch=master)](https://travis-ci.org/uttori/uttori-storage-provider-json-memory)
[![Dependency Status](https://david-dm.org/uttori/uttori-storage-provider-json-memory.svg)](https://david-dm.org/uttori/uttori-storage-provider-json-memory)
[![Coverage Status](https://coveralls.io/repos/uttori/uttori-storage-provider-json-memory/badge.svg?branch=master)](https://coveralls.io/r/uttori/uttori-storage-provider-json-memory?branch=master)

# Uttori Storage Provider - JSON Memory

Uttori storage provider using JavaScript objects in memory. This does NOT persist or restore.

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

# API Reference

## Classes

<dl>
<dt><a href="#StorageProvider">StorageProvider</a></dt>
<dd><p>Storage for Uttori documents using JSON files stored on the local file system.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#UttoriDocument">UttoriDocument</a></dt>
<dd></dd>
</dl>

<a name="StorageProvider"></a>

## StorageProvider
Storage for Uttori documents using JSON files stored on the local file system.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| documents | [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) | The collection of documents. |
| history | <code>Object</code> | The collection of document histories indexes. |
| histories | <code>Object</code> | The collection of document revisions by index. |


* [StorageProvider](#StorageProvider)
    * [new StorageProvider()](#new_StorageProvider_new)
    * [.documents](#StorageProvider+documents) : [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
    * [.all()](#StorageProvider+all) ⇒ <code>Array</code>
    * [.tags()](#StorageProvider+tags) ⇒ <code>Array</code>
    * [.getQuery(query)](#StorageProvider+getQuery) ⇒ [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
    * [.get(slug)](#StorageProvider+get) ⇒ [<code>UttoriDocument</code>](#UttoriDocument)
    * [.getHistory(slug)](#StorageProvider+getHistory) ⇒ <code>Object</code>
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
this.documents All documents.

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
<a name="StorageProvider+tags"></a>

### storageProvider.tags() ⇒ <code>Array</code>
Returns all unique tags.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Array</code> - Returns an array of all unique tags.  
**Example**  
```js
storageProvider.tags();
➜ ['first-tag', ...]
```
<a name="StorageProvider+getQuery"></a>

### storageProvider.getQuery(query) ⇒ [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
Returns all documents matching a given query.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: [<code>Array.&lt;UttoriDocument&gt;</code>](#UttoriDocument) - All matching documents.  

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

### storageProvider.getHistory(slug) ⇒ <code>Object</code>
Returns the history of edits for a given slug.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Object</code> - The returned history object.  

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
| params | <code>Object</code> |  |
| params.slug | <code>String</code> | The slug of the document to be returned. |
| params.revision | <code>String</code> \| <code>Number</code> | The unix timestamp of the history to be returned. |

<a name="StorageProvider+add"></a>

### storageProvider.add(document)
Saves a document to the file system.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be added to the collection. |

<a name="StorageProvider+updateValid"></a>

### storageProvider.updateValid(params) ℗
Updates a document and saves to the file system.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Access**: private  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be updated in the collection. |
| params.originalSlug | <code>String</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="StorageProvider+update"></a>

### storageProvider.update(params)
Updates a document and figures out how to save to the file system.
Calling with a new document will add that document.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.document | [<code>UttoriDocument</code>](#UttoriDocument) | The document to be updated in the collection. |
| params.originalSlug | <code>String</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="StorageProvider+delete"></a>

### storageProvider.delete(slug)
Removes a document from the file system.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>String</code> | The slug identifying the document. |

<a name="StorageProvider+reset"></a>

### storageProvider.reset()
Resets to the initial state.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
<a name="StorageProvider+updateHistory"></a>

### storageProvider.updateHistory(params)
Updates History for a given slug, renaming the store file and history folder as needed.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>Object</code> |  |
| params.slug | <code>String</code> | The slug of the document to update history for. |
| params.content | [<code>UttoriDocument</code>](#UttoriDocument) | The revision of the document to be saved. |
| [params.originalSlug] | <code>String</code> | The original slug identifying the document, or the slug if it has not changed. |

<a name="UttoriDocument"></a>

## UttoriDocument
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| slug | <code>String</code> |  | The unique identifier for the document. |
| [title] | <code>String</code> | <code>&#x27;&#x27;</code> | The unique identifier for the document. |
| [createDate] | <code>Number</code> \| <code>Date</code> |  | The creation date of the document. |
| [updateDate] | <code>Number</code> \| <code>Date</code> |  | The last date the document was updated. |
| [tags] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | The unique identifier for the document. |
| [customData] | <code>Object</code> | <code>{}</code> | Any extra meta data for the document. |


* * *

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
npm install
npm test
DEBUG=Uttori* npm test
```

## Contributors

* [Matthew Callis](https://github.com/MatthewCallis)

## License

* [MIT](LICENSE)

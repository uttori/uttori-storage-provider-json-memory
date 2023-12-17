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
    * [new StorageProvider([config])](#new_StorageProvider_new)
    * [.all()](#StorageProvider+all) ⇒ <code>Promise.&lt;object&gt;</code>
    * [.getQuery(query)](#StorageProvider+getQuery) ⇒ <code>Promise.&lt;(number\|Array.&lt;any&gt;)&gt;</code>
    * [.get(slug)](#StorageProvider+get) ⇒ [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
    * [.getHistory(slug)](#StorageProvider+getHistory) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
    * [.getRevision(params)](#StorageProvider+getRevision) ⇒ [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
    * [.add(document)](#StorageProvider+add)
    * [.updateValid(params)](#StorageProvider+updateValid) ℗
    * [.update(params)](#StorageProvider+update)
    * [.delete(slug)](#StorageProvider+delete)
    * [.reset()](#StorageProvider+reset)
    * [.updateHistory(params)](#StorageProvider+updateHistory)

<a name="new_StorageProvider_new"></a>

### new StorageProvider([config])
Creates an instance of StorageProvider.


| Param | Type | Description |
| --- | --- | --- |
| [config] | <code>object</code> | A configuration object. |
| [config.updateTimestamps] | <code>boolean</code> | Should update times be marked at the time of edit. |
| [config.useHistory] | <code>boolean</code> | Should history entries be created. |

**Example** *(Init StorageProvider)*  
```js
const storageProvider = new StorageProvider();
```
<a name="StorageProvider+all"></a>

### storageProvider.all() ⇒ <code>Promise.&lt;object&gt;</code>
Returns all documents.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Promise.&lt;object&gt;</code> - All documents.  
**Example**  
```js
storageProvider.all();
➜ { 'first-document': { slug: 'first-document', ... }, ... }
```
<a name="StorageProvider+getQuery"></a>

### storageProvider.getQuery(query) ⇒ <code>Promise.&lt;(number\|Array.&lt;any&gt;)&gt;</code>
Returns all documents matching a given query.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Promise.&lt;(number\|Array.&lt;any&gt;)&gt;</code> - The items matching the supplied query.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The conditions on which documents should be returned. |

<a name="StorageProvider+get"></a>

### storageProvider.get(slug) ⇒ [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
Returns a document for a given slug.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument) - The returned UttoriDocument.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The slug of the document to be returned. |

<a name="StorageProvider+getHistory"></a>

### storageProvider.getHistory(slug) ⇒ <code>Promise.&lt;Array.&lt;string&gt;&gt;</code>
Returns the history of edits for a given slug.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: <code>Promise.&lt;Array.&lt;string&gt;&gt;</code> - The returned history object.  

| Param | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The slug of the document to get history for. |

<a name="StorageProvider+getRevision"></a>

### storageProvider.getRevision(params) ⇒ [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument)
Returns a specifc revision from the history of edits for a given slug and revision timestamp.

**Kind**: instance method of [<code>StorageProvider</code>](#StorageProvider)  
**Returns**: [<code>Promise.&lt;UttoriDocument&gt;</code>](#UttoriDocument) - The returned revision of the document.  

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

| Name | Type | Description |
| --- | --- | --- |
| slug | <code>string</code> | The unique identifier for the document. |
| [createDate] | <code>number</code> \| <code>Date</code> | The creation date of the document. |
| [updateDate] | <code>number</code> \| <code>Date</code> | The last date the document was updated. |


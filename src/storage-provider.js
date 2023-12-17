import processQuery from './query-tools.js';

let debug = (..._) => {};
/* c8 ignore next */
try { const { default: d } = await import('debug'); debug = d('Uttori.Plugin.StorageProvider.JSON'); } catch {}

/**
 * @typedef UttoriDocument The document object we store, with only the minimum methods we access listed.
 * @property {string} slug The unique identifier for the document.
 * @property {number|Date} [createDate] The creation date of the document.
 * @property {number|Date} [updateDate] The last date the document was updated.
 */

/**
 * Storage for Uttori documents using JSON objects in memory.
 * @property {UttoriDocument[]} documents - The collection of documents.
 * @property {object} history - The collection of document histories indexes.
 * @property {object} histories - The collection of document revisions by index.
 * @example <caption>Init StorageProvider</caption>
 * const storageProvider = new StorageProvider();
 * @class
 */
class StorageProvider {
/**
 * Creates an instance of StorageProvider.
 * @param {object} [config] - A configuration object.
 * @param {boolean} [config.updateTimestamps] - Should update times be marked at the time of edit.
 * @param {boolean} [config.useHistory] - Should history entries be created.
 * @class
 */
  constructor(config = {}) {
    debug('constructor');

    this.config = {
      updateTimestamps: true,
      useHistory: true,
      ...config,
    };

    this.documents = {};
    this.history = {};
    this.histories = {};

    this.all = this.all.bind(this);
    this.getQuery = this.getQuery.bind(this);
    this.get = this.get.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.getRevision = this.getRevision.bind(this);
    this.add = this.add.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.reset = this.reset.bind(this);
    this.updateHistory = this.updateHistory.bind(this);
  }

  /**
   * Returns all documents.
   * @returns {Promise<object>} All documents.
   * @example
   * ```js
   * storageProvider.all();
   * ➜ { 'first-document': { slug: 'first-document', ... }, ... }
   * ```
   */
  async all() {
    debug('all');
    return this.documents;
  }

  /**
   * Returns all documents matching a given query.
   * @param {string} query - The conditions on which documents should be returned.
   * @returns {Promise<number | any[]>} The items matching the supplied query.
   */
  async getQuery(query) {
    debug('getQuery:', query);
    return processQuery(query, Object.values(await this.all()));
  }

  /**
   * Returns a document for a given slug.
   * @param {string} slug - The slug of the document to be returned.
   * @returns {Promise<UttoriDocument>} The returned UttoriDocument.
   * @memberof StorageProvider
   */
  async get(slug) {
    debug('get', slug);
    if (!slug) {
      debug('Cannot get document without slug.', slug);
      return;
    }
    const document = this.documents[slug];
    if (!document) {
      debug('No document found!');
      return;
    }
    // eslint-disable-next-line consistent-return
    return { ...document };
  }

  /**
   * Returns the history of edits for a given slug.
   * @param {string} slug - The slug of the document to get history for.
   * @returns {Promise<string[]>} The returned history object.
   * @memberof StorageProvider
   */
  async getHistory(slug) {
    debug('getHistory', slug);
    if (!slug) {
      debug('Cannot get document history without slug.', slug);
      return;
    }
    // eslint-disable-next-line consistent-return
    return this.history[slug] || [];
  }

  /**
   * Returns a specifc revision from the history of edits for a given slug and revision timestamp.
   * @param {object} params - The params object.
   * @param {string} params.slug - The slug of the document to be returned.
   * @param {string|number} params.revision - The unix timestamp of the history to be returned.
   * @returns {Promise<UttoriDocument>} The returned revision of the document.
   * @memberof StorageProvider
   */
  async getRevision({ slug, revision }) {
    debug('getRevision', slug, revision);
    if (!slug) {
      debug('Cannot get document history without slug.', slug);
      return;
    }
    if (!revision) {
      debug('Cannot get document history without revision.', revision);
      return;
    }
    const document = this.history[slug] && this.histories[`${slug}-${revision}`] ? this.histories[`${slug}-${revision}`] : undefined;
    if (!document) {
      debug(`Document history not found for "${slug}", with revision "${revision}"`);
    }
    // eslint-disable-next-line consistent-return
    return document;
  }

  /**
   * Saves a document to internal array.
   * @param {UttoriDocument} document - The document to be added to the collection.
   * @memberof StorageProvider
   */
  async add(document) {
    if (!document || !document.slug) {
      debug('add: Cannot add, missing slug.');
      return;
    }
    document = { ...document };
    const existing = await this.get(document.slug);
    if (!existing) {
      debug('add: New Document:', document.slug);
      const date = document.createDate || Date.now();
      document.createDate = date;
      document.updateDate = document.createDate;
      if (this.config.useHistory) {
        await this.updateHistory({ slug: document.slug, content: document });
      }
      this.documents[document.slug] = document;
      const random = Math.random().toString(36).slice(8);
      this.history[document.slug] = [`${date}-${random}`];
      this.histories[`${document.slug}-${date}-${random}`] = document;
    } else {
      debug('add: Cannot add, existing document!');
    }
  }

  /**
   * Updates a document and saves to memory.
   * @private
   * @param {object} params - The params object.
   * @param {UttoriDocument} params.document - The document to be updated in the collection.
   * @param {string} params.originalSlug - The original slug identifying the document, or the slug if it has not changed.
   * @memberof StorageProvider
   */
  async updateValid({ document, originalSlug }) {
    debug('updateValid');
    document = { ...document };
    if (this.config.updateTimestamps) {
      document.updateDate = Date.now();
    }
    if (this.config.useHistory) {
      this.updateHistory({ slug: document.slug, content: document, originalSlug });
    }
    this.documents[originalSlug] = document;
  }

  /**
   * Updates a document and figures out how to save to memory.
   * Calling with a new document will add that document.
   * @param {object} params - The params object.
   * @param {UttoriDocument} params.document - The document to be updated in the collection.
   * @param {string} params.originalSlug - The original slug identifying the document, or the slug if it has not changed.
   * @memberof StorageProvider
   */
  async update({ document, originalSlug }) {
    debug('update');
    if (!document || !document.slug) {
      debug('Cannot update, missing slug.');
      return;
    }
    debug('update:', document.slug, originalSlug);
    const existing = await this.get(document.slug);
    const original = originalSlug ? await this.get(originalSlug) : undefined;
    if (existing && original && original.slug !== existing.slug) {
      debug(`Cannot update, existing document with slug "${originalSlug}"!`);
    } else if (existing && original && original.slug === existing.slug) {
      debug(`Updating document with slug "${document.slug}"`);
      await this.updateValid({ document, originalSlug });
    } else if (existing && !original) {
      debug(`Updating document with slug "${document.slug}" but no originalSlug`);
      await this.updateValid({ document, originalSlug: document.slug });
    } else if (!existing && original) {
      debug(`Updating document with slug from "${originalSlug}" to "${document.slug}"`);
      await this.updateValid({ document, originalSlug });
    } else {
      debug(`No document found to update with slug "${originalSlug || ''}", adding document with slug "${document.slug}"`);
      await this.add(document);
    }
  }

  /**
   * Removes a document from memory.
   * @param {string} slug - The slug identifying the document.
   * @memberof StorageProvider
   */
  async delete(slug) {
    debug('delete:', slug);
    const existing = await this.get(slug);
    if (existing) {
      debug('Document found, deleting document:', slug);
      if (this.config.useHistory) {
        await this.updateHistory({ slug, content: existing });
      }
      delete this.documents[slug];
    } else {
      debug('Document not found:', slug);
    }
  }

  // Format Specific Methods

  /**
   * Resets to the initial state.
   * @memberof StorageProvider
   */
  reset() {
    debug('reset');
    this.documents = {};
    this.history = {};
    this.histories = {};
  }

  /**
   * Updates History for a given slug, renaming the key and history key as needed.
   * @param {object} params - The params object.
   * @param {string} params.slug - The slug of the document to update history for.
   * @param {UttoriDocument} params.content - The revision of the document to be saved.
   * @param {string} [params.originalSlug] - The original slug identifying the document, or the slug if it has not changed.
   * @memberof StorageProvider
   */
  async updateHistory({ slug, content, originalSlug }) {
    // Rename old history folder if one existed
    if (slug && originalSlug && originalSlug !== slug && this.history[originalSlug]) {
      debug(`updateHistory: Updating history from "${originalSlug}" to "${slug}"`);
      this.history[slug] = [...this.history[originalSlug]];
      delete this.history[originalSlug];

      // Rename old histories
      for (const key of Object.keys(this.histories)) {
        if (key.startsWith(`${originalSlug}-`)) {
          const new_key = key.replace(originalSlug, slug);
          this.histories[new_key] = { ...this.histories[key] };
          delete this.histories[key];
        }
      }
    }
    if (!Array.isArray(this.history[slug])) {
      debug('updateHistory: Creating history...');
      this.history[slug] = [];
    }

    const random = Math.random().toString(36).slice(8);
    this.history[slug].push(`${Date.now()}-${random}`);
    this.histories[`${slug}-${Date.now()}-${random}`] = content;
    debug('updateHistory:', random);
  }
}

export default StorageProvider;

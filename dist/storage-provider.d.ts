export default StorageProvider;
/**
 * The document object we store, with only the minimum methods we access listed.
 */
export type UttoriDocument = {
    /**
     * The unique identifier for the document.
     */
    slug: string;
    /**
     * The creation date of the document.
     */
    createDate?: number | Date;
    /**
     * The last date the document was updated.
     */
    updateDate?: number | Date;
};
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
declare class StorageProvider {
    /**
     * Creates an instance of StorageProvider.
     * @param {object} [config] - A configuration object.
     * @param {boolean} [config.updateTimestamps] - Should update times be marked at the time of edit.
     * @param {boolean} [config.useHistory] - Should history entries be created.
     * @class
     */
    constructor(config?: {
        updateTimestamps?: boolean;
        useHistory?: boolean;
    });
    config: {
        updateTimestamps: boolean;
        useHistory: boolean;
    };
    documents: {};
    history: {};
    histories: {};
    /**
     * Returns all documents.
     * @returns {Promise<object>} All documents.
     * @example
     * ```js
     * storageProvider.all();
     * ➜ { 'first-document': { slug: 'first-document', ... }, ... }
     * ```
     */
    all(): Promise<object>;
    /**
     * Returns all documents matching a given query.
     * @param {string} query - The conditions on which documents should be returned.
     * @returns {Promise<number | any[]>} The items matching the supplied query.
     */
    getQuery(query: string): Promise<number | any[]>;
    /**
     * Returns a document for a given slug.
     * @param {string} slug - The slug of the document to be returned.
     * @returns {Promise<UttoriDocument>} The returned UttoriDocument.
     * @memberof StorageProvider
     */
    get(slug: string): Promise<UttoriDocument>;
    /**
     * Returns the history of edits for a given slug.
     * @param {string} slug - The slug of the document to get history for.
     * @returns {Promise<string[]>} The returned history object.
     * @memberof StorageProvider
     */
    getHistory(slug: string): Promise<string[]>;
    /**
     * Returns a specifc revision from the history of edits for a given slug and revision timestamp.
     * @param {object} params - The params object.
     * @param {string} params.slug - The slug of the document to be returned.
     * @param {string|number} params.revision - The unix timestamp of the history to be returned.
     * @returns {Promise<UttoriDocument>} The returned revision of the document.
     * @memberof StorageProvider
     */
    getRevision({ slug, revision }: {
        slug: string;
        revision: string | number;
    }): Promise<UttoriDocument>;
    /**
     * Saves a document to internal array.
     * @param {UttoriDocument} document - The document to be added to the collection.
     * @memberof StorageProvider
     */
    add(document: UttoriDocument): Promise<void>;
    /**
     * Updates a document and saves to memory.
     * @private
     * @param {object} params - The params object.
     * @param {UttoriDocument} params.document - The document to be updated in the collection.
     * @param {string} params.originalSlug - The original slug identifying the document, or the slug if it has not changed.
     * @memberof StorageProvider
     */
    private updateValid;
    /**
     * Updates a document and figures out how to save to memory.
     * Calling with a new document will add that document.
     * @param {object} params - The params object.
     * @param {UttoriDocument} params.document - The document to be updated in the collection.
     * @param {string} params.originalSlug - The original slug identifying the document, or the slug if it has not changed.
     * @memberof StorageProvider
     */
    update({ document, originalSlug }: {
        document: UttoriDocument;
        originalSlug: string;
    }): Promise<void>;
    /**
     * Removes a document from memory.
     * @param {string} slug - The slug identifying the document.
     * @memberof StorageProvider
     */
    delete(slug: string): Promise<void>;
    /**
     * Resets to the initial state.
     * @memberof StorageProvider
     */
    reset(): void;
    /**
     * Updates History for a given slug, renaming the key and history key as needed.
     * @param {object} params - The params object.
     * @param {string} params.slug - The slug of the document to update history for.
     * @param {UttoriDocument} params.content - The revision of the document to be saved.
     * @param {string} [params.originalSlug] - The original slug identifying the document, or the slug if it has not changed.
     * @memberof StorageProvider
     */
    updateHistory({ slug, content, originalSlug }: {
        slug: string;
        content: UttoriDocument;
        originalSlug?: string;
    }): Promise<void>;
}
//# sourceMappingURL=storage-provider.d.ts.map
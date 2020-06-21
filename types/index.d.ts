/**
 * Uttori Storage Provider - JSON Memory, Uttori Plugin Adapter
 * @example
 * <caption>Plugin</caption>
 * const storage = Plugin.callback(viewModel, context);
 */
declare class Plugin {
    /**
     * The configuration key for plugin to look for in the provided configuration.
     * @example
     * <caption>Plugin.configKey</caption>
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     */
    static configKey: string;
    /**
     * The default configuration.
     * @example
     * <caption>Plugin.defaultConfig()</caption>
     * const config = { ...Plugin.defaultConfig(), ...context.config[Plugin.configKey] };
     * @returns The configuration.
     */
    static defaultConfig(): any;
    /**
     * Register the plugin with a provided set of events on a provided Hook system.
     * @example
     * <caption>Plugin.register(context)</caption>
     * const context = {
     *   hooks: {
     *     on: (event, callback) => { ... },
     *   },
     *   config: {
     *     [Plugin.configKey]: {
     *       ...,
     *       events: {
     *         add: ['storage-add'],
     *         delete: ['storage-delete'],
     *         get: ['storage-get'],
     *         getHistory: ['storage-get-history'],
     *         getRevision: ['storage-get-revision'],
     *         getQuery: ['storage-query'],
     *         update: ['storage-update'],
     *       },
     *     },
     *   },
     * };
     * Plugin.register(context);
     * @param context - A Uttori-like context.
     * @param context.hooks - An event system / hook system to use.
     * @param context.hooks.on - An event registration function.
     * @param context.config - A provided configuration to use.
     * @param context.config.events - An object whose keys correspong to methods, and contents are events to listen for.
     */
    static register(context: {
        hooks: {
            on: (...params: any[]) => any;
        };
        config: {
            events: any;
        };
    }): void;
}

/**
 * Processes a query string.
 * @example
 * process('SELECT name FROM table WHERE age > 1 ORDER BY RANDOM LIMIT 3', [{ ... }, ...]);
 * ➜ [{ ... }, ...]
 * @param query - The SQL-like query to parse.
 * @param objects - An array of object to search within.
 * @returns Returns an array of all matched documents.
 */
declare function process(query: string, objects: object[]): object[];

/**
 * @property slug - The unique identifier for the document.
 * @property [title = ''] - The unique identifier for the document.
 * @property [createDate] - The creation date of the document.
 * @property [updateDate] - The last date the document was updated.
 * @property [tags = []] - The unique identifier for the document.
 * @property [customData = {}] - Any extra meta data for the document.
 */
declare type UttoriDocument = {
    slug: string;
    title?: string;
    createDate?: number | Date;
    updateDate?: number | Date;
    tags?: string[];
    customData?: any;
};

/**
 * Creates an instance of StorageProvider.
 * @example
 * <caption>Init StorageProvider</caption>
 * const storageProvider = new StorageProvider();
 * @property documents - The collection of documents.
 * @property history - The collection of document histories indexes.
 * @property histories - The collection of document revisions by index.
 * @param [config] - A configuration object.
 * @param [config.update_timestamps = true] - Should update times be marked at the time of edit.
 * @param [config.use_history = true] - Should history entries be created.
 */
declare class StorageProvider {
    constructor(config?: {
        update_timestamps?: boolean;
        use_history?: boolean;
    });
    /**
     * Returns all documents.
     * @example
     * storageProvider.all();
     * ➜ [{ slug: 'first-document', ... }, ...]
     * @returns All documents.
     */
    all(): any[];
    /**
     * Returns all documents matching a given query.
     * @param query - The conditions on which documents should be returned.
     * @returns The items matching the supplied query.
     */
    getQuery(query: string): any[];
    /**
     * Returns a document for a given slug.
     * @param slug - The slug of the document to be returned.
     * @returns The returned UttoriDocument.
     */
    get(slug: string): UttoriDocument;
    /**
     * Returns the history of edits for a given slug.
     * @param slug - The slug of the document to get history for.
     * @returns The returned history object.
     */
    getHistory(slug: string): any;
    /**
     * Returns a specifc revision from the history of edits for a given slug and revision timestamp.
     * @param params - The params object.
     * @param params.slug - The slug of the document to be returned.
     * @param params.revision - The unix timestamp of the history to be returned.
     * @returns The returned revision of the document.
     */
    getRevision(params: {
        slug: string;
        revision: string | number;
    }): UttoriDocument;
    /**
     * Saves a document to internal array.
     * @param document - The document to be added to the collection.
     */
    add(document: UttoriDocument): void;
    /**
     * Updates a document and figures out how to save to memory.
     * Calling with a new document will add that document.
     * @param params - The params object.
     * @param params.document - The document to be updated in the collection.
     * @param params.originalSlug - The original slug identifying the document, or the slug if it has not changed.
     */
    update(params: {
        document: UttoriDocument;
        originalSlug: string;
    }): void;
    /**
     * Removes a document from memory.
     * @param slug - The slug identifying the document.
     */
    delete(slug: string): void;
    /**
     * Resets to the initial state.
     */
    reset(): void;
    /**
     * Updates History for a given slug, renaming the key and history key as needed.
     * @param params - The params object.
     * @param params.slug - The slug of the document to update history for.
     * @param params.content - The revision of the document to be saved.
     * @param [params.originalSlug] - The original slug identifying the document, or the slug if it has not changed.
     */
    updateHistory(params: {
        slug: string;
        content: UttoriDocument;
        originalSlug?: string;
    }): void;
    /**
     * The collection of documents.
    */
    documents: UttoriDocument[];
    /**
     * The collection of document histories indexes.
    */
    history: any;
    /**
     * The collection of document revisions by index.
    */
    histories: any;
}


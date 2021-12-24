declare module "@uttori/storage-provider-json-memory";

declare module "query-tools" {
    export function processQuery(query: string, objects: object[]): object[] | number;
}
declare module "storage-provider" {
    export = StorageProvider;
    class StorageProvider {
        constructor(config?: {
            update_timestamps?: boolean;
            use_history?: boolean;
        });
        config: {
            update_timestamps: boolean;
            use_history: boolean;
        };
        documents: {};
        history: {};
        histories: {};
        all(): object;
        getQuery(query: string): any[];
        get(slug: string): UttoriDocument;
        getHistory(slug: string): string[];
        getRevision({ slug, revision }: {
            slug: string;
            revision: string | number;
        }): UttoriDocument;
        add(document: UttoriDocument): void;
        private updateValid;
        update({ document, originalSlug }: {
            document: UttoriDocument;
            originalSlug: string;
        }): void;
        delete(slug: string): void;
        reset(): void;
        updateHistory({ slug, content, originalSlug }: {
            slug: string;
            content: UttoriDocument;
            originalSlug?: string;
        }): void;
    }
    namespace StorageProvider {
        export { UttoriDocument };
    }
    type UttoriDocument = {
        slug: string;
        createDate?: number | Date;
        updateDate?: number | Date;
    };
}
declare module "plugin" {
    export = Plugin;
    class Plugin {
        static get configKey(): string;
        static defaultConfig(): object;
        static register(context: {
            hooks: {
                on: Function;
            };
            config: {
                events: object;
            };
        }): void;
    }
}
declare module "index" {
    export const StorageProvider: typeof import("storage-provider");
    export const Plugin: typeof import("plugin");
}

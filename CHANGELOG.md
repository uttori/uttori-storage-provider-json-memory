# Change Log

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](http://semver.org/).

## [5.0.0](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v4.2.1...v5.0.0) - 2023-12-16

- 💥 BREAKING CHANGES!
- 💥 Rename config key: `update_timestamps` to `updateTimestamps`
- 💥 Rename config key: `use_history` to `useHistory`
- 🎁 Convert to be a module, and require Node v20
- 🎁 Update dependencies
- 🎁 Update dev dependencies
- 🛠 Update ESLint configuration
- 🛠 Update NVM to v20.10.0
- 🛠 Update old tooling configuration files
- 🛠 Remove CJS support, restructure to export ESM only
- 🛠 Make all methods `async` functions
- 🧰 Add support for `EXCLUDES` as the opposite of `INCLUDES` for `SELECT` queries
- 🛠 Migrate all Ramda functions to native JavaScript

## [4.1.2](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v4.1.1...v4.1.2) - 2021-12-22

- 🎁 Update dev dependencies

## [4.1.1](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v4.1.0...v4.1.1) - 2021-10-18

- 🛠 Fix return type for getHistory
- 🎁 Update dev dependencies

## [4.1.0](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v4.0.0...v4.1.0) - 2021-02-28

- 🛠 Switch memory cache data type (Array ➜ Object)
- 🛠 Fix return types
- 🛠 Remove auto adding `tags`, `customData` fields
- 🎁 Update dev dependencies

## [4.0.0](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v3.4.3...v4.0.0) - 2021-01-16

- 🧰 Add ESM Support
- 🧰 Add explicit exports
- 🧰 Add support for `COUNT(*)` as  stand alone `SELECT` field for returning counts.
- 🎁 Update dev dependencies

## [3.4.3](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v3.4.2...v3.4.3) - 2020-11-15

- 🧰 Make `debug` an optional dependency

## [3.4.2](https://github.com/uttori/uttori-storage-provider-json-memory/compare/v3.4.1...v3.4.2) - 2020-11-15

- 🎁 Update dev dependencies
- 🎁 Update README badge URLs
- 🧰 Change how types are made and rebuild types
- 🧰 Created this file

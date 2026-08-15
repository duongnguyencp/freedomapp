// Metro config for a pnpm monorepo. Lets Metro watch and resolve
// packages/financial-engine (consumed as TypeScript source directly — no
// separate build step needed for the app to pick up changes).
// https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
// NOTE: deliberately NOT setting resolver.disableHierarchicalLookup here.
// pnpm's node_modules is strict/nested (not hoisted like npm/yarn), so
// transitive deps only resolve via each package's own node_modules
// symlink — hierarchical lookup is what finds those. Disabling it breaks
// resolution of things like `whatwg-fetch` used by @expo/metro-runtime.

module.exports = config;

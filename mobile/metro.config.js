const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Enable symlinks resolution
config.resolver.unstable_enableSymlinks = true;

// Watch the convex folder at the monorepo root
config.watchFolders = [monorepoRoot];

// Add node_modules paths for resolution
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Ensure we can resolve from the monorepo root
config.resolver.disableHierarchicalLookup = false;

module.exports = config;


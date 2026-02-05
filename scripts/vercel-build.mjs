#!/usr/bin/env node
import { execSync } from 'node:child_process';

const vercelEnv = process.env.VERCEL_ENV || 'production';
const deployKey = process.env.CONVEX_DEPLOY_KEY || '';
const isProdKey = deployKey.startsWith('prod:');
const isPreviewKey = deployKey.startsWith('preview:');
const buildCmd = 'turbo run build --filter=@repo/web';
const convexDeployCmd = `cd packages/convex && npx convex deploy --cmd "cd ../.. && ${buildCmd}"`;

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

function buildOnly(reason) {
  if (reason) {
    console.log(`[vercel-build] ${reason}`);
  }
  run(buildCmd);
}

if (vercelEnv === 'production') {
  if (!deployKey) {
    buildOnly('CONVEX_DEPLOY_KEY not set for production; skipping convex deploy.');
  } else {
    run(convexDeployCmd);
  }
} else {
  if (!deployKey) {
    buildOnly(`CONVEX_DEPLOY_KEY not set for ${vercelEnv}; skipping convex deploy.`);
  } else if (isProdKey) {
    buildOnly(`Detected production deploy key in ${vercelEnv} build; skipping convex deploy.`);
  } else {
    run(convexDeployCmd);
  }
}

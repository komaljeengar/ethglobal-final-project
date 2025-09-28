#!/usr/bin/env node

// Alternative build script that avoids Rollup native dependencies
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting alternative build process...');

try {
  // Set environment variables to avoid Rollup issues
  process.env.VITE_LEGACY_BUILD = 'false';
  process.env.NODE_ENV = 'production';
  process.env.ROLLUP_DISABLE_NATIVE = 'true';
  
  // Try to install the missing Rollup native dependency
  console.log('🔧 Attempting to fix Rollup native dependencies...');
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --force', { 
      stdio: 'pipe',
      env: {
        ...process.env,
        NPM_CONFIG_OPTIONAL: 'false'
      }
    });
    console.log('✅ Rollup native dependency installed');
  } catch (installError) {
    console.log('⚠️  Could not install Rollup native dependency, continuing...');
  }
  
  // Use Vite with specific flags to avoid native dependencies
  const buildCommand = 'npx vite build --mode production --minify esbuild --target esnext';
  
  console.log('📦 Running build command:', buildCommand);
  execSync(buildCommand, { 
    stdio: 'inherit',
    env: {
      ...process.env,
      VITE_LEGACY_BUILD: 'false',
      NODE_ENV: 'production',
      ROLLUP_DISABLE_NATIVE: 'true'
    }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Verify dist directory exists
  if (fs.existsSync('dist')) {
    console.log('📁 Dist directory created successfully');
    const files = fs.readdirSync('dist');
    console.log('📄 Generated files:', files.length);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

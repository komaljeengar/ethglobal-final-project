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
  
  // Debug: Check what's in node_modules
  console.log('🔍 Checking node_modules...');
  try {
    const nodeModulesExists = fs.existsSync('node_modules');
    console.log('📁 node_modules exists:', nodeModulesExists);
    
    if (nodeModulesExists) {
      const viteExists = fs.existsSync('node_modules/vite');
      console.log('📦 vite package exists:', viteExists);
      
      const viteBinExists = fs.existsSync('node_modules/.bin/vite');
      console.log('🔧 vite binary exists:', viteBinExists);
    }
  } catch (debugError) {
    console.log('⚠️  Could not check node_modules:', debugError.message);
  }
  
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
  
  // Try different approaches to run Vite
  const buildCommands = [
    './node_modules/.bin/vite build --config vite.config.simple.ts',
    'npx vite build --config vite.config.simple.ts',
    './node_modules/.bin/vite build --mode production --minify esbuild --target esnext',
    'npx vite build --mode production --minify esbuild --target esnext',
    'npm run build'
  ];
  
  let buildSuccess = false;
  
  for (const buildCommand of buildCommands) {
    console.log('📦 Trying build command:', buildCommand);
    try {
      execSync(buildCommand, { 
        stdio: 'inherit',
        env: {
          ...process.env,
          VITE_LEGACY_BUILD: 'false',
          NODE_ENV: 'production',
          ROLLUP_DISABLE_NATIVE: 'true'
        }
      });
      console.log('✅ Build completed successfully with:', buildCommand);
      buildSuccess = true;
      break;
    } catch (error) {
      console.log('❌ Build failed with:', buildCommand);
      console.log('Error:', error.message);
      if (buildCommand === buildCommands[buildCommands.length - 1]) {
        throw error; // Re-throw the last error
      }
      console.log('🔄 Trying next build command...');
    }
  }
  
  if (!buildSuccess) {
    throw new Error('All build commands failed');
  }
  
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

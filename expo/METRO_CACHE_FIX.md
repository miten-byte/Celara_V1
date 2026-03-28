# Metro Bundler Cache Error Fix

## Error
```
Requiring unknown module "2970". If you are sure the module exists, try restarting Metro.
```

## Solution

This error occurs when Metro bundler's cache gets out of sync. To fix it:

### Option 1: Clear cache and restart (Recommended)
```bash
# Stop the current dev server (Ctrl+C)
# Then run:
npx expo start --clear
```

### Option 2: Manual cache clearing
```bash
# Stop the current dev server
# Clear all caches:
rm -rf node_modules/.cache
rm -rf .expo
# Restart:
npm start
```

### Option 3: Complete reset (if above doesn't work)
```bash
# Stop dev server
# Remove all caches and reinstall:
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache
bun install
npx expo start --clear
```

## What Happened
The Metro bundler assigns numeric IDs to modules. When you:
- Add/remove dependencies
- Significantly refactor code
- Switch branches with different dependencies

The cached module IDs can become stale, causing this error.

## Prevention
- Always restart Metro after installing/uninstalling packages
- Use `--clear` flag when seeing cache-related issues
- Clear cache periodically during heavy development

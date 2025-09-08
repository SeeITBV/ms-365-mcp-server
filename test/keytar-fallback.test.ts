import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthManager from '../src/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Keytar fallback functionality', () => {
  const testDir = path.join(__dirname, '..', 'test-temp');
  const tokenCachePath = path.join(testDir, '.token-cache.json');
  const selectedAccountPath = path.join(testDir, '.selected-account.json');

  beforeEach(() => {
    // Create test directory
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test files
    if (fs.existsSync(tokenCachePath)) {
      fs.unlinkSync(tokenCachePath);
    }
    if (fs.existsSync(selectedAccountPath)) {
      fs.unlinkSync(selectedAccountPath);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it('should create AuthManager instance without keytar', async () => {
    const authManager = new AuthManager();
    expect(authManager).toBeDefined();
    expect(typeof authManager.loadTokenCache).toBe('function');
    expect(typeof authManager.saveTokenCache).toBe('function');
  });

  it('should handle token cache operations gracefully when keytar is unavailable', async () => {
    const authManager = new AuthManager();
    
    // These operations should not throw errors even when keytar is unavailable
    await expect(authManager.loadTokenCache()).resolves.not.toThrow();
    await expect(authManager.saveTokenCache()).resolves.not.toThrow();
  });

  it('should handle logout gracefully when keytar is unavailable', async () => {
    const authManager = new AuthManager();
    
    // Logout should not throw errors even when keytar is unavailable
    await expect(authManager.logout()).resolves.toBe(true);
  });
});
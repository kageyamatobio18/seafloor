/**
 * OpenClaw Config Validator
 * Validates openclaw.json configuration files
 */

const fs = require('fs');
const path = require('path');

// Known valid top-level keys
const VALID_TOP_KEYS = [
  'gateway', 'agents', 'channels', 'models', 'commands', 
  'messages', 'plugins', 'session', 'hooks', 'meta', 'broadcast'
];

// Known channel types
const VALID_CHANNELS = [
  'telegram', 'whatsapp', 'discord', 'signal', 'slack',
  'googlechat', 'imessage', 'bluebubbles', 'msteams', 
  'matrix', 'webchat', 'line', 'nostr', 'zalo', 'mattermost'
];

// Known model providers
const KNOWN_PROVIDERS = [
  'anthropic', 'openai', 'openrouter', 'google', 'deepseek',
  'groq', 'together', 'fireworks', 'mistral', 'ollama', 'lmstudio'
];

class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validate(config) {
    this.errors = [];
    this.warnings = [];

    if (typeof config !== 'object' || config === null) {
      this.errors.push('Config must be an object');
      return this.result();
    }

    // Check for unknown top-level keys
    for (const key of Object.keys(config)) {
      if (!VALID_TOP_KEYS.includes(key)) {
        this.warnings.push(`Unknown top-level key: "${key}"`);
      }
    }

    // Validate sections
    if (config.channels) this.validateChannels(config.channels);
    if (config.agents) this.validateAgents(config.agents);
    if (config.models) this.validateModels(config.models);
    if (config.gateway) this.validateGateway(config.gateway);

    return this.result();
  }

  validateChannels(channels) {
    if (typeof channels !== 'object') {
      this.errors.push('channels must be an object');
      return;
    }

    for (const [name, config] of Object.entries(channels)) {
      if (!VALID_CHANNELS.includes(name)) {
        this.warnings.push(`Unknown channel type: "${name}"`);
      }

      if (config.enabled === true) {
        // Channel-specific validation
        if (name === 'telegram') {
          if (!config.botToken) {
            this.errors.push('telegram.botToken is required when enabled');
          }
          if (config.dmPolicy === 'open' && !config.allowFrom?.includes('*')) {
            this.errors.push('telegram.allowFrom must include "*" when dmPolicy is "open"');
          }
        }

        if (name === 'discord') {
          if (!config.botToken) {
            this.errors.push('discord.botToken is required when enabled');
          }
        }
      }
    }
  }

  validateAgents(agents) {
    if (typeof agents !== 'object') {
      this.errors.push('agents must be an object');
      return;
    }

    if (agents.defaults?.model) {
      const model = agents.defaults.model;
      if (typeof model === 'string') {
        if (!model.includes('/')) {
          this.warnings.push(`Model "${model}" should include provider prefix (e.g., anthropic/claude-...)`);
        }
      } else if (typeof model === 'object') {
        if (model.primary && !model.primary.includes('/')) {
          this.warnings.push(`Primary model "${model.primary}" should include provider prefix`);
        }
      }
    }
  }

  validateModels(models) {
    if (typeof models !== 'object') {
      this.errors.push('models must be an object');
      return;
    }

    if (models.providers) {
      for (const [name, provider] of Object.entries(models.providers)) {
        if (!KNOWN_PROVIDERS.includes(name) && !name.includes('/')) {
          this.warnings.push(`Unknown model provider: "${name}" (might be custom)`);
        }

        if (provider.apiKey && provider.apiKey.startsWith('sk-') && provider.apiKey.length < 20) {
          this.warnings.push(`${name}.apiKey looks incomplete`);
        }
      }
    }
  }

  validateGateway(gateway) {
    if (typeof gateway !== 'object') {
      this.errors.push('gateway must be an object');
      return;
    }

    if (gateway.port && (gateway.port < 1 || gateway.port > 65535)) {
      this.errors.push('gateway.port must be between 1 and 65535');
    }

    if (gateway.auth?.mode === 'password' && !gateway.auth?.password) {
      this.errors.push('gateway.auth.password is required when mode is "password"');
    }
  }

  result() {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}

/**
 * Validate a config object
 */
function validate(config) {
  const validator = new ConfigValidator();
  return validator.validate(config);
}

/**
 * Validate a config file
 */
function validateFile(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Try parsing as-is first (standard JSON)
    try {
      const config = JSON.parse(content);
      return validate(config);
    } catch (jsonErr) {
      // If that fails, try cleaning JSON5 features
      const cleaned = content
        .replace(/\/\/.*$/gm, '') // Remove single-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
        .replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
      
      const config = JSON.parse(cleaned);
      return validate(config);
    }
  } catch (err) {
    return {
      valid: false,
      errors: [`Failed to parse config: ${err.message}`],
      warnings: []
    };
  }
}

/**
 * Find the default config file
 */
function findConfigFile() {
  const candidates = [
    path.join(process.env.HOME || '', '.openclaw', 'openclaw.json'),
    './openclaw.json'
  ];
  
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

module.exports = {
  validate,
  validateFile,
  findConfigFile,
  ConfigValidator
};

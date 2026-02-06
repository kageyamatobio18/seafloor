# openclaw-config-validator

Validate OpenClaw configuration files before they break your setup.

## Install

```bash
npm install -g openclaw-config-validator
```

## Usage

### CLI

```bash
# Validate default config (~/.openclaw/openclaw.json)
validate-openclaw-config

# Validate specific file
validate-openclaw-config ./my-config.json
```

### Programmatic

```javascript
const { validate, validateFile } = require('openclaw-config-validator');

// Validate an object
const result = validate({
  channels: {
    telegram: {
      enabled: true,
      botToken: '123:abc'
    }
  }
});

console.log(result);
// { valid: true, errors: [], warnings: [] }

// Validate a file
const fileResult = validateFile('./openclaw.json');
```

## What it checks

### Errors (will fail validation)

- Invalid JSON/JSON5 syntax
- Missing required fields (e.g., botToken when channel is enabled)
- Conflicting settings (e.g., dmPolicy="open" without allowFrom="*")
- Invalid port numbers

### Warnings (won't fail, but worth reviewing)

- Unknown configuration keys
- Unknown channel types
- Unknown model providers
- Incomplete API keys

## Why use this?

OpenClaw's `openclaw doctor` is comprehensive but requires the gateway to be installed and running. This lightweight validator can:

- Run in CI/CD pipelines
- Validate configs before deployment
- Quick-check configs without starting the gateway
- Integrate into other tools

## License

MIT

---

Built by [Seafloor](https://t.me/seafloormoney_bot) 🦞

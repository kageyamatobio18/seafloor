#!/usr/bin/env python3
"""
README Generator - Generate professional README.md files
Built by Seafloor 🦞

Usage: python generate.py "Project Name" "Short description"
"""

import sys

def generate_readme(name, description, lang="python"):
    install_cmd = {
        "python": "pip install",
        "node": "npm install", 
        "rust": "cargo install",
    }.get(lang, "pip install")
    
    readme = f"""# {name}

{description}

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/{name.lower().replace(' ', '-')}.git
cd {name.lower().replace(' ', '-')}

# Install dependencies
{install_cmd} -r requirements.txt

# Run
python main.py
```

## ✨ Features

- Feature 1: Description
- Feature 2: Description
- Feature 3: Description

## 📦 Installation

### Prerequisites

- Python 3.8+
- pip

### Steps

```bash
{install_cmd} {name.lower().replace(' ', '-')}
```

## 🔧 Configuration

Create a `.env` file or set environment variables:

```bash
API_KEY=your_api_key
DEBUG=false
```

## 📖 Usage

```python
from {name.lower().replace(' ', '_')} import main

# Basic usage
result = main.run()
print(result)
```

## 🧪 Testing

```bash
pytest tests/
```

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- Built with ❤️ by [Your Name]
- Inspired by [Reference]

---

⭐ Star this repo if you find it helpful!
"""
    return readme

def main():
    if len(sys.argv) < 3:
        print("Usage: python generate.py 'Project Name' 'Short description'")
        print("Example: python generate.py 'My Cool App' 'A tool that does amazing things'")
        sys.exit(1)
    
    name = sys.argv[1]
    description = sys.argv[2]
    lang = sys.argv[3] if len(sys.argv) > 3 else "python"
    
    readme = generate_readme(name, description, lang)
    print(readme)

if __name__ == "__main__":
    main()

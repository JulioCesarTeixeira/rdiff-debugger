# 🔍 Runtime Diff Debugger

[![npm version](https://badge.fury.io/js/rdiff-debugger.svg)](https://badge.fury.io/js/rdiff-debugger)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A simple CLI tool for debugging flaky tests and nondeterministic functions by capturing and comparing runtime behavior.**

## 🚀 Why Runtime Diff Debugger?

Ever had a test that passes sometimes and fails other times? Functions that return different results on each run even with the same input? **Runtime Diff Debugger** helps you identify exactly what's changing between runs by:

- 🎯 **Capturing nondeterministic sources** like `Date.now()` and `Math.random()`
- 🔄 **Running your function multiple times** with consistent captured values
- 📊 **Showing precise differences** between runs with deep object comparison
- 🛠️ **Zero setup required** - works with any JavaScript/TypeScript function

## 📦 Installation

```bash
# Install globally to use the rdiff CLI anywhere
npm install -g rdiff-debugger

# Or install locally in your project
npm install rdiff-debugger --save-dev
```

## ⚡ Quick Start

1. **Create a test function** (or use an existing one):

```javascript
// my-function.js
export function generateData() {
  return {
    id: Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    user: {
      name: "John",
      score: Math.random() * 100
    }
  };
}
```

2. **Run the diff debugger**:

```bash
rdiff run my-function.js generateData
```

3. **Analyze the results**:

```bash
$ rdiff run simple.js myFunction

✅ No differences detected

OR

❌ Differences found:
[
  DiffEdit {
    kind: 'E',
    path: [ 'user', 'name' ],
    lhs: 'John',
    rhs: 'Jane'
  }
  DiffArray {
    kind: 'A',
    path: [ 'preferences' ],
    index: 2,
    item: DiffNew { kind: 'N', rhs: 'dark-mode' }
  }
]
```


## 🎯 Use Cases

### 🧪 Debugging Flaky Tests
```bash
# Find out why your test fails intermittently
rdiff run tests/flaky-test.js problematicFunction
```

### 🔄 API Response Consistency
```bash
# Check if your API mock returns consistent data
rdiff run mocks/api.js getUserProfile
```

### 🎲 Random Data Generation
```bash
# Verify your data generators work as expected
rdiff run generators/user.js createRandomUser
```

## 🛠️ How It Works

Runtime Diff Debugger works by:

1. **Intercepting nondeterministic functions**:
   - `Date.now()` → Returns the same timestamp for both runs
   - `Math.random()` → Returns the same random values for both runs

2. **Running your function twice** with identical captured values

3. **Deep comparing results** to show exactly what differs

This approach isolates **true behavioral differences** from **timing and randomness artifacts**.

## 📖 API Reference

### CLI Commands

#### `rdiff run <file> <functionName>`

Runs a function twice and compares the results.

**Parameters:**
- `file`: Path to JavaScript/TypeScript file containing the function
- `functionName`: Name of the exported function to test

**Examples:**
```bash
# Basic usage
rdiff run utils.js helperFunction

# With TypeScript (ensure it's compiled first)
rdiff run dist/services.js processData

# Relative paths work too
rdiff run ./src/generators/user.js createUser
```

### Programmatic Usage

```javascript
import { captureRun, compareRuns } from 'rdiff-debugger';

// Capture a single run
const snapshot = await captureRun("test-run", () => {
  return { 
    id: Math.random(),
    time: Date.now() 
  };
});

// Compare two runs
const run1 = await captureRun("run1", myFunction);
const run2 = await captureRun("run2", myFunction);
const differences = compareRuns(run1, run2);

if (differences) {
  console.log("Found differences:", differences);
}
```

## 📁 Examples

Check out the [examples directory](./examples/) for a few examples:

```bash
# Clone the repository
git clone https://github.com/JulioCesarTeixeira/rdiff-debugger.git
cd rdiff-debugger/examples

# Install example dependencies
npm install

# Run examples
npm run test:simple     # Basic example with Math.random and Date.now
npm run test:user       # Complex user profile with faker.js
npm run test:product    # E-commerce product data example
```

### Example Output

```bash
$ rdiff run simple.js myFunction

❌ Differences found:
[
  DiffEdit {
    kind: 'E',
    path: [ 'user', 'email' ],
    lhs: 'john@example.com',
    rhs: 'jane@example.com'
  },
  DiffArray {
    kind: 'A',
    path: [ 'preferences' ],
    index: 2,
    item: DiffNew { kind: 'N', rhs: 'dark-mode' }
  }
]
```

## 🔧 Configuration

### Function Requirements

Your functions must be:
- **Exported** from a ES module (`export function myFunc()`)  
- **Synchronous or async** (both `() => result` and `async () => result` work)
- **Pure or impure** (side effects are fine, but only return value differences are captured)


## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes and add tests
4. **Commit** your changes: `git commit -m 'Add amazing feature'`
5. **Push** to the branch: `git push origin feature/amazing-feature`
6. **Open** a Pull Request

### Development Setup

```bash
# Clone and setup
git clone https://github.com/JulioCesarTeixeira/rdiff-debugger.git
cd rdiff-debugger
npm install

# Build the project
npm run build

# Link for local testing
npm link
rdiff --help
```

## 🐛 Troubleshooting

### Common Issues

**"Function not found"**
```bash
# Make sure your function is exported
export function myFunction() { ... }

# Not: function myFunction() { ... }
```

**"ESM syntax not allowed"**
```bash
# Ensure your package.json has:
{
  "type": "module"
}
```

**"Module not found"**
```bash
# Use relative or absolute paths
rdiff run ./my-file.js myFunction
rdiff run /full/path/to/file.js myFunction
```

## 📋 Requirements

- **Node.js** >= 16.0.0
- **ES Modules** support (`"type": "module"` in package.json)

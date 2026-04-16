
---

# Contributing to Icon Font Reducer

Thank you for your interest in contributing to Icon Font Reducer!  
Contributions of all kinds are welcome - bug reports, feature requests, implementations of unsupported icon libraries, documentation improvements, and pull requests.

This document explains how to participate in the project effectively.

---

## Reporting Issues

When reporting an issue, include:

- A clear description of the problem  
- Your Icon Font Reducer version
- Steps to reproduce  
- Your Node.js version  
- Your NPM version  
- The exact command you are running
- Any relevant logs or error messages  
- Whether you are using a custom config

This helps maintainers reproduce and fix the issue quickly.

---

## Requesting Features

Feature requests are welcome.  
Before opening a new request:

1. Check if the feature already exists  
2. Search existing issues to avoid duplicates  
3. Explain your use case clearly  
4. Describe why the feature would benefit the project  

Well‑explained proposals are more likely to be accepted.

---

## Submitting Pull Requests

Pull requests are greatly appreciated.  
To ensure a smooth review process:

#### 1. Fork the repository  
Create your own branch from `main`.

#### 2. Make focused changes  
Each PR should address **one** issue or feature.

#### 3. Follow the coding style  
Keep your code consistent with the existing project structure.

#### 4. Add or update documentation  
If your change affects usage, commands, or behavior, update the README accordingly.

#### 5. Test your changes  
Ensure the plugin works correctly in a real Composer project. To test Icon Font Reducer without installing it in a project, you can replace `npm run icon-font-reducer` with `node bin/icon-font-reducer.js`. For example:

```sh
node bin/icon-font-reducer.js --dest="/public/icons" 
```

#### 6. Write a clear PR description  
Explain what the change does and why it’s needed.

---

## Testing Your Contribution

Before submitting a PR, test it in a real project:

1. Run Icon Font Reducer with all configurations or flags
2. Test packing and loading icons in the project
3. Test with and without custom config files  ble  

This ensures your contribution is stable across environments.

---

## Code of Conduct

Be respectful, constructive, and collaborative.  
We welcome contributors of all backgrounds and experience levels.

---

## License

By contributing to Icon Font Reducer, you agree that your contributions will be licensed under the MIT License.

---

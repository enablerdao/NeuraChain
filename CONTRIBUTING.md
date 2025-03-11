# Contributing to HyperNova Chain

Thank you for your interest in contributing to HyperNova Chain! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

- A clear, descriptive title
- A detailed description of the issue
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment information (OS, browser, etc.)

### Suggesting Enhancements

If you have an idea for an enhancement, please create an issue with the following information:

- A clear, descriptive title
- A detailed description of the enhancement
- The motivation behind the enhancement
- Any potential implementation details

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Create a new Pull Request

### Coding Standards

- **Rust**: Follow the [Rust Style Guide](https://doc.rust-lang.org/1.0.0/style/README.html)
- **Python**: Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- **JavaScript/TypeScript**: Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **Solidity**: Follow the [Solidity Style Guide](https://docs.soliditylang.org/en/v0.8.17/style-guide.html)

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Development Setup

Please refer to the README.md file for detailed setup instructions.

## Testing

- **Core**: Run `cargo test` in the `/core` directory
- **AI**: Run `pytest` in the `/ai` directory
- **SDK**: Run `npm test` in the `/sdk` directory
- **Frontend**: Run `npm test` in the `/frontend` directory

## Documentation

- Document all public APIs, functions, and methods
- Update the README.md file if necessary
- Add examples for new features

## License

By contributing to HyperNova Chain, you agree that your contributions will be licensed under the project's MIT License.
# Nexus JS

Nexus JS is an interactive CLI for scaffolding Express.js backend projects.

## Requirements

- Node.js 24 or newer
- npm, pnpm, yarn

## Usage

```bash
# npm
npm create nexus@latest

# pnpm
pnpm create nexus@latest

# yarn
yarn create nexus

```

You can provide the project name directly:

```bash
npm create nexus@latest my-api
```

## CLI options

```bash
npx create-nexus@latest --help
npx create-nexus@latest my-api --skip-install
npx create-nexus@latest my-api --pm pnpm
```

## Included choices

- JavaScript or TypeScript
- Basic Express, MVC, or feature-based Modular architecture
- Automatic dependency installation
- Package manager detection (npm, pnpm, yarn)

## Local development

```bash
npm install
npm link
create-nexus
```

## Publish

Update the version in `package.json`, then:

```bash
npm login
npm publish
```

To publish a release under the `stable` dist-tag:

```bash
npm publish --tag stable
```

For a normal `latest` release:

```bash
npm publish --tag latest
```

Important: npm's default dist-tag is `latest`. Therefore `npm create nexus` resolves the package's `latest` tag; it does not automatically mean `stable`. Users can explicitly run `npm create nexus@stable` for the stable tag.

## Notes

This is a starter generator. Review generated security settings, environment variables, database integration, and deployment configuration before using a scaffold in production.

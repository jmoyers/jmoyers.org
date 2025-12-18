# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `yarn install` - Install dependencies
- `yarn dev` - Start development server with hot reload (runs both CSS watcher and Eleventy)
- `yarn build` - Build for production
- `yarn clean` - Clean build artifacts

### Build Components
- `yarn build:css` - Build CSS from SCSS
- `yarn build:11ty` - Build static site with Eleventy
- `yarn build:backprop` - Build backprop teaching app
- `yarn watch:css` - Watch SCSS files for changes
- `yarn watch:11ty` - Watch site files with Eleventy dev server

### TypeScript CLI
- `yarn cli` - Run the TypeScript CLI tool
- `yarn cli status` - Show current project status
- `yarn cli config` - List all configurable variables
- `yarn cli deploy-infra` - Deploy AWS infrastructure using Terraform
- `yarn cli update-env` - Update .env.local with Terraform outputs
- `yarn cli deploy` - Deploy website to S3 and invalidate CloudFront cache
- `yarn cli terraform [args...]` - Run Terraform commands with proper environment

### Important CLI Rules
- **NEVER use raw `terraform` commands** - always use `yarn cli terraform [args...]`
- **NEVER run destructive commands** like `yarn cli deploy-infra` or `yarn cli deploy` without explicit user permission
- **NEVER edit `.env.local`** - it's user-managed and protected
- Use `--no-cli-pager` flag or `AWS_PAGER=""` to prevent AWS CLI output issues

## Repository Architecture

### Static Site Generator
- **11ty (Eleventy)** - Static site generator with Nunjucks templates
- **SCSS** - CSS preprocessing with Sass
- **TypeScript** - Build toolchain and CLI
- **Turbo** - Build caching (configured but minimal usage)

### Project Structure
```
src/
├── _includes/          # Nunjucks templates
│   ├── base.njk       # Base layout
│   ├── home.njk       # Homepage layout
│   └── post.njk       # Blog post layout
├── _data/             # Global data and computed values
│   └── eleventyComputed.js  # Permalink computation
├── assets/            # Static assets
│   ├── scss/          # SCSS source files
│   ├── fonts/         # Font files
│   └── images/        # Image assets
├── content/           # Site content
│   ├── index.md       # Homepage content
│   ├── posts.njk      # Blog listing page
│   └── posts/         # Blog posts (markdown with frontmatter)
├── cli/               # TypeScript CLI tool
│   └── index.ts       # CLI implementation
└── scripts/           # Legacy shell scripts
```

### Build Output
- `dist/` - Production build output
- `dist/css/` - Compiled CSS
- `dist/posts/` - Generated blog pages
- `dist/backprop/` - Backpropagation teaching app

## Standalone Apps

Standalone React/Vite apps are kept separate from the main Eleventy site but deploy to the same infrastructure.

### backprop/
Interactive teaching app for the 1986 Rumelhart, Hinton & Williams backpropagation paper.

- **Stack**: React + TypeScript + Vite
- **URL**: https://jmoyers.org/backprop/
- **Build**: `yarn build:backprop` (runs automatically with `yarn build`)
- **Dev**: `cd backprop && yarn dev` (runs on port 5173)

#### Important
- The app has its own `package.json` and `yarn.lock` (separate Yarn project)
- Vite base path is set to `/backprop/` for correct asset URLs
- Built output is copied to `dist/backprop/` during main build

### Development Workflow
The development server runs two processes concurrently:
1. **SCSS watcher** - Compiles SCSS to CSS on changes
2. **Eleventy server** - Serves site with hot reload on port 8080

## AWS Infrastructure

### Architecture
- **S3 Bucket** - Static website hosting
- **CloudFront** - CDN with SSL certificate
- **ACM Certificate** - SSL/TLS certificate with DNS validation
- **Route53** - Optional DNS management
- **Terraform** - Infrastructure as Code

### Environment Configuration
- Environment variables managed in `.env.local` (not committed)
- Use `env.template` as starting point
- CLI automatically updates `.env.local` after Terraform operations

### Deployment Process
1. **Infrastructure**: `yarn cli deploy-infra` (with confirmation)
2. **Update env**: `yarn cli update-env` (auto-runs after infra deployment)
3. **Deploy site**: `yarn cli deploy`

### Cost Controls
- CloudFront uses PriceClass_100 (US, Canada, Europe only)
- Budget alerts configured via Terraform
- Emergency brake: Disable CloudFront with `enable_cloudfront=false`

## Content Management

### Blog Posts
- Create posts in `src/content/posts/[slug]/index.md`
- Use frontmatter for metadata:
  ```yaml
  ---
  title: "Post Title"
  date: "YYYY-MM-DD"
  tags: ["tag1", "tag2"]
  ---
  ```
- Permalink structure: `/posts/[slug]/`

### Templates
- **base.njk** - Site-wide layout and structure
- **home.njk** - Homepage-specific layout
- **post.njk** - Blog post layout with metadata

## Package Management

### Always Use Yarn
- **NEVER use `npm`** - repository uses Yarn 4.5.3
- Package manager enforced via `packageManager` field
- Yarn workspaces not used (single package)

### Dependencies
- **Runtime**: chalk, commander, dotenv, execa, inquirer, ora
- **Dev**: 11ty, TypeScript, Sass, tsx, markdown-it, cheerio
- **Build**: Node.js >=18.0.0 required

## TypeScript Configuration

### Build Process
- Source: `src/` directory
- Output: `dist/` directory
- Target: ES2022 with Node.js types
- CLI builds to `dist/cli/index.js` with executable permissions

### Development
- `tsx watch` for TypeScript execution with hot reload
- TypeScript compilation for production builds
- Source maps enabled for debugging

## Testing

### Current State
- **No test framework currently configured**
- No unit tests, integration tests, or e2e tests
- No testing dependencies in package.json

### If Tests Are Added
- Consider Jest or Vitest for unit testing
- Playwright for potential e2e testing
- Test static site generation and CLI functionality

## Security and Best Practices

### Environment Variables
- Sensitive data in `.env.local` (gitignored)
- AWS credentials via AWS CLI profiles preferred
- Never commit secrets or API keys

### Infrastructure Security
- S3 bucket private, only accessible via CloudFront
- CloudFront enforces HTTPS
- Origin Access Control (OAC) used instead of legacy OAI

## Emergency Procedures

### Cost Spiral Protection
If AWS costs become excessive:
1. **Immediate**: Disable CloudFront distribution
   ```bash
   yarn cli terraform plan -var="enable_cloudfront=false"
   yarn cli terraform apply -var="enable_cloudfront=false"
   ```
2. **Monitor**: Use AWS Cost Explorer and CloudWatch
3. **Re-enable**: Change back to `enable_cloudfront=true` and apply

### Troubleshooting
- Check AWS CLI configuration and credentials
- Verify `.env.local` file exists and is properly configured
- Use `yarn cli status` to diagnose current state
- Check Terraform state in `infrastructure/aws/`
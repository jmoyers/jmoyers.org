# jmoyers.org

Personal website built with 11ty, TypeScript, and SCSS. Deployed to AWS S3 +
CloudFront.

## Tech Stack

- **11ty** - Static site generator
- **TypeScript** - Build toolchain
- **SCSS** - Styling with Sass
- **Yarn** - Package management
- **Turborepo** - Build caching (configured but not actively used yet)
- **AWS S3 + CloudFront** - Hosting (infrastructure setup pending)

## Development

```bash
# Install dependencies
yarn install

# Set up environment variables for deployment
cp env.template .env.local
# Edit .env.local with your AWS credentials

# Start development server with hot reload
yarn dev

# Build for production
yarn build

# Deploy to AWS (after infrastructure setup)
./scripts/deploy.sh

# Clean build artifacts
yarn clean
```

## Project Structure

```
src/
├── _includes/          # Templates
│   ├── base.njk       # Base layout
│   ├── home.njk       # Homepage layout
│   └── post.njk       # Blog post layout
├── assets/            # Static assets
│   ├── scss/          # Styles
│   ├── fonts/         # Fonts
│   └── images/        # Images
├── content/           # Content
│   ├── index.md       # Homepage
│   ├── posts.njk      # Blog listing
│   └── posts/         # Blog posts (markdown)
└── _data/             # Global data
    └── eleventyComputed.js  # Computed permalinks

dist/                  # Build output
```

## Writing Posts

Create a new markdown file in `src/content/posts/[slug]/index.md`:

```markdown
---
title: "Your Post Title"
date: "2024-07-06"
tags: ["tag1", "tag2"]
---

Your content here...
```

## Deployment

AWS infrastructure is configured and ready for deployment:

- **S3 bucket** for static hosting
- **CloudFront** for CDN with SSL certificate
- **Route53** for DNS (optional migration)
- **Terraform** for infrastructure as code

### Setup

1. Configure AWS credentials in `.env.local`
2. Deploy infrastructure: `cd infrastructure/aws && terraform apply`
3. Update `.env.local` with Terraform outputs:
   `./scripts/update-env-from-terraform.sh`
4. Deploy site: `./scripts/deploy.sh`

See `infrastructure/aws/README.md` for detailed instructions.

## Migration from Hugo

This site was migrated from Hugo to 11ty in July 2024. Key changes:

- Hugo → 11ty for static site generation
- Go toolchain → Node.js/TypeScript
- Docker/DigitalOcean → AWS S3/CloudFront
- Same content and visual design preserved
- Updated contact email to jmoyers@gmail.com
- Updated title to CTO @ Encamp

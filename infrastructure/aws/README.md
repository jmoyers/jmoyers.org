# AWS Infrastructure for jmoyers.org

This directory contains Terraform configuration for hosting jmoyers.org on AWS
using S3 + CloudFront + Route53.

## Architecture

- **S3 Bucket**: Static website hosting
- **CloudFront**: CDN with SSL certificate and custom domain
- **ACM Certificate**: SSL/TLS certificate for HTTPS
- **Route53**: DNS management (optional for migration)

## Prerequisites

1. AWS CLI installed and configured
2. Terraform installed (>= 1.0)
3. AWS credentials with appropriate permissions
4. Copy `env.template` to `.env.local` and configure your AWS settings

## Environment Setup

### 1. Configure Environment Variables

```bash
# Copy the template and edit with your values
cp env.template .env.local

# Edit .env.local with your AWS credentials and settings
# You can use either AWS credentials or an AWS profile
# Make sure to set AWS_REGION (required for Terraform and deployment)
```

## Deployment Steps

### Option 1: Using the automated script (recommended)

```bash
# From project root
./scripts/terraform-apply.sh
```

This script will:

- Load environment variables from `.env.local`
- Initialize Terraform if needed
- Run `terraform plan` for review
- Apply changes after confirmation
- Provide next steps

### Option 2: Manual deployment

```bash
# 1. Source environment variables
source .env.local
export TF_VAR_aws_region="$AWS_REGION"

# 2. Initialize Terraform
cd infrastructure/aws
terraform init

# 3. Review the plan
terraform plan

# 4. Deploy infrastructure
terraform apply

# 5. Update environment variables
cd ../..
./scripts/update-env-from-terraform.sh
```

Both the automated script and `terraform apply` will automatically populate your
`.env.local` file with:

- CloudFront Distribution ID
- S3 Bucket Name
- CloudFront Domain Name
- Certificate ARN
- Route53 Zone ID (if using Route53)

### 5. Get outputs (optional)

```bash
cd infrastructure/aws
terraform output
```

## Configuration

### Certificate Validation

Since we're not initially using Route53 for DNS, you'll need to manually
validate the SSL certificate:

1. Run `terraform apply`
2. When it creates the ACM certificate, it will output DNS validation records
3. Add these records to your current DNS provider (DigitalOcean)
4. Wait for validation to complete
5. Continue with the deployment

### DNS Migration (Optional)

To migrate DNS from DigitalOcean to Route53:

1. Set `create_route53_zone = true` in your terraform variables
2. Run `terraform apply`
3. Update your domain registrar to use the Route53 name servers
4. Wait for DNS propagation

## Variables

- `aws_region`: AWS region (default: us-west-2)
- `domain_name`: Your domain (default: jmoyers.org)
- `create_route53_zone`: Whether to create Route53 hosted zone (default: false)

## Outputs

- `cloudfront_distribution_id`: Use this for cache invalidation
- `s3_bucket_name`: S3 bucket name for file uploads
- `cloudfront_url`: Direct CloudFront URL
- `website_url`: Your website URL

## Post-Deployment

1. Update the `CLOUDFRONT_DISTRIBUTION_ID` in `scripts/deploy.sh`
2. Use `./scripts/deploy.sh` to deploy your site
3. Update DNS records to point to CloudFront (if not using Route53)

## Cost Optimization

- CloudFront uses PriceClass_100 (US, Canada, Europe only)
- S3 bucket has versioning enabled but no lifecycle rules
- Consider adding S3 lifecycle rules for cost optimization if needed

## Security

- S3 bucket is private, only accessible via CloudFront
- CloudFront enforces HTTPS
- Origin Access Control (OAC) used instead of legacy OAI
- Terraform state files and variables are properly gitignored
- Only `.terraform.lock.hcl` is committed (for provider version locking)

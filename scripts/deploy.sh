#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables if .env.local exists
if [ -f .env.local ]; then
    source .env.local
fi

# Configuration (can be overridden by environment variables)
BUCKET_NAME=${DOMAIN_NAME:-"jmoyers.org"}
CLOUDFRONT_DISTRIBUTION_ID=${CLOUDFRONT_DISTRIBUTION_ID:-""}
AWS_REGION=${AWS_REGION:-"us-west-2"}

echo -e "${YELLOW}Starting deployment...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed${NC}"
    exit 1
fi

# Check if required environment variables are set
if [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}Warning: CLOUDFRONT_DISTRIBUTION_ID not set, skipping cache invalidation${NC}"
    echo -e "${YELLOW}Tip: Run './scripts/update-env-from-terraform.sh' to populate from Terraform outputs${NC}"
fi

# Build the site
echo -e "${YELLOW}Building site...${NC}"
yarn build

# Sync files to S3
echo -e "${YELLOW}Syncing files to S3 (region: $AWS_REGION)...${NC}"

# Sync static assets with long cache headers
aws s3 sync dist/ s3://$BUCKET_NAME/ \
    --region $AWS_REGION \
    --exclude "*.html" \
    --exclude "*.xml" \
    --exclude "*.txt" \
    --cache-control "public, max-age=31536000, immutable" \
    --delete

# Sync HTML files with short cache headers
aws s3 sync dist/ s3://$BUCKET_NAME/ \
    --region $AWS_REGION \
    --exclude "*" \
    --include "*.html" \
    --include "*.xml" \
    --include "*.txt" \
    --cache-control "public, max-age=300" \
    --delete

# Set special cache headers for specific files
aws s3 cp dist/index.html s3://$BUCKET_NAME/index.html \
    --region $AWS_REGION \
    --cache-control "public, max-age=0, must-revalidate"

aws s3 cp dist/404.html s3://$BUCKET_NAME/404.html \
    --region $AWS_REGION \
    --cache-control "public, max-age=300"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    echo -e "${GREEN}Invalidation created: $INVALIDATION_ID${NC}"
    echo -e "${YELLOW}Waiting for invalidation to complete...${NC}"
    
    aws cloudfront wait invalidation-completed \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --id $INVALIDATION_ID
    
    echo -e "${GREEN}Cache invalidation completed${NC}"
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Site available at: https://$BUCKET_NAME${NC}" 
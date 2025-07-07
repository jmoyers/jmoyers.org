#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TERRAFORM_DIR="infrastructure/aws"
ENV_FILE=".env.local"
ENV_TEMPLATE="env.template"

echo -e "${YELLOW}Updating .env.local with Terraform outputs...${NC}"

# Check if Terraform directory exists
if [ ! -d "$TERRAFORM_DIR" ]; then
    echo -e "${RED}Error: Terraform directory '$TERRAFORM_DIR' not found${NC}"
    exit 1
fi

# Check if Terraform state exists
if [ ! -f "$TERRAFORM_DIR/terraform.tfstate" ]; then
    echo -e "${RED}Error: No Terraform state found. Run 'terraform apply' first.${NC}"
    exit 1
fi

# Create .env.local from template if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Creating $ENV_FILE from template...${NC}"
    cp "$ENV_TEMPLATE" "$ENV_FILE"
fi

# Get Terraform outputs
echo -e "${YELLOW}Fetching Terraform outputs...${NC}"
cd "$TERRAFORM_DIR"

# Check if terraform outputs are available
if ! terraform output > /dev/null 2>&1; then
    echo -e "${RED}Error: Failed to get Terraform outputs${NC}"
    exit 1
fi

# Extract outputs (handle both with and without quotes)
CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id 2>/dev/null || echo "")
S3_BUCKET_NAME=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "")
CLOUDFRONT_DOMAIN_NAME=$(terraform output -raw cloudfront_domain_name 2>/dev/null || echo "")
CERTIFICATE_ARN=$(terraform output -raw certificate_arn 2>/dev/null || echo "")
ROUTE53_ZONE_ID=$(terraform output -raw route53_zone_id 2>/dev/null || echo "")

cd - > /dev/null

# Function to update or add environment variable
update_env_var() {
    local key=$1
    local value=$2
    local file=$3
    
    if [ -z "$value" ] || [ "$value" = "null" ]; then
        echo -e "${YELLOW}Warning: $key is empty or null, skipping...${NC}"
        return
    fi
    
    # Check if the key already exists
    if grep -q "^${key}=" "$file"; then
        # Update existing value
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^${key}=.*|${key}=${value}|" "$file"
        else
            # Linux
            sed -i "s|^${key}=.*|${key}=${value}|" "$file"
        fi
        echo -e "${GREEN}Updated: $key${NC}"
    elif grep -q "^# ${key}=" "$file"; then
        # Uncomment and update commented line
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s|^# ${key}=.*|${key}=${value}|" "$file"
        else
            # Linux
            sed -i "s|^# ${key}=.*|${key}=${value}|" "$file"
        fi
        echo -e "${GREEN}Uncommented and updated: $key${NC}"
    else
        # Add new value at the end
        echo "" >> "$file"
        echo "# Added by update-env-from-terraform.sh" >> "$file"
        echo "${key}=${value}" >> "$file"
        echo -e "${GREEN}Added: $key${NC}"
    fi
}

# Create backup
cp "$ENV_FILE" "${ENV_FILE}.backup"
echo -e "${YELLOW}Created backup: ${ENV_FILE}.backup${NC}"

# Update environment variables
echo -e "${YELLOW}Updating environment variables...${NC}"

update_env_var "CLOUDFRONT_DISTRIBUTION_ID" "$CLOUDFRONT_DISTRIBUTION_ID" "$ENV_FILE"
update_env_var "S3_BUCKET_NAME" "$S3_BUCKET_NAME" "$ENV_FILE"
update_env_var "CLOUDFRONT_DOMAIN_NAME" "$CLOUDFRONT_DOMAIN_NAME" "$ENV_FILE"
update_env_var "CERTIFICATE_ARN" "$CERTIFICATE_ARN" "$ENV_FILE"

# Only add Route53 zone ID if it's not null (optional output)
if [ -n "$ROUTE53_ZONE_ID" ] && [ "$ROUTE53_ZONE_ID" != "null" ]; then
    update_env_var "ROUTE53_ZONE_ID" "$ROUTE53_ZONE_ID" "$ENV_FILE"
fi

echo -e "${GREEN}✅ Successfully updated $ENV_FILE with Terraform outputs${NC}"
echo -e "${YELLOW}📋 Summary of values:${NC}"
echo -e "   CloudFront Distribution ID: ${CLOUDFRONT_DISTRIBUTION_ID:-'(not set)'}"
echo -e "   S3 Bucket Name: ${S3_BUCKET_NAME:-'(not set)'}"
echo -e "   CloudFront Domain: ${CLOUDFRONT_DOMAIN_NAME:-'(not set)'}"
echo -e "   Certificate ARN: ${CERTIFICATE_ARN:-'(not set)'}"
if [ -n "$ROUTE53_ZONE_ID" ] && [ "$ROUTE53_ZONE_ID" != "null" ]; then
    echo -e "   Route53 Zone ID: ${ROUTE53_ZONE_ID}"
fi

echo -e "${YELLOW}🚀 Ready to deploy with: ./scripts/deploy.sh${NC}" 
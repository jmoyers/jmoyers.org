#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

TERRAFORM_DIR="infrastructure/aws"
ENV_FILE=".env.local"

echo -e "${YELLOW}Running Terraform with environment variables...${NC}"

# Check if .env.local exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}Error: $ENV_FILE not found. Copy env.template to .env.local and configure it.${NC}"
    exit 1
fi

# Load environment variables
echo -e "${YELLOW}Loading environment variables from $ENV_FILE...${NC}"
source "$ENV_FILE"

# Export Terraform variables from environment
if [ -n "$AWS_REGION" ]; then
    export TF_VAR_aws_region="$AWS_REGION"
    echo -e "${GREEN}Using AWS region: $AWS_REGION${NC}"
else
    echo -e "${YELLOW}AWS_REGION not set, using default (us-west-2)${NC}"
fi

if [ -n "$DOMAIN_NAME" ]; then
    export TF_VAR_domain_name="$DOMAIN_NAME"
    echo -e "${GREEN}Using domain: $DOMAIN_NAME${NC}"
fi

# Set AWS profile if specified
if [ -n "$AWS_PROFILE" ]; then
    export AWS_PROFILE="$AWS_PROFILE"
    echo -e "${GREEN}Using AWS profile: $AWS_PROFILE${NC}"
fi

# Change to terraform directory
cd "$TERRAFORM_DIR"

# Check if terraform is initialized
if [ ! -d ".terraform" ]; then
    echo -e "${YELLOW}Initializing Terraform...${NC}"
    terraform init
fi

# Run terraform plan first
echo -e "${YELLOW}Running terraform plan...${NC}"
terraform plan

# Ask for confirmation
echo -e "${YELLOW}Do you want to apply these changes? (y/N)${NC}"
read -r confirmation

if [[ $confirmation == [yY] || $confirmation == [yY][eE][sS] ]]; then
    echo -e "${YELLOW}Applying Terraform changes...${NC}"
    terraform apply
    
    echo -e "${GREEN}✅ Terraform apply completed successfully!${NC}"
    echo -e "${YELLOW}💡 Next steps:${NC}"
    echo -e "   1. Run: cd ../.. && ./scripts/update-env-from-terraform.sh"
    echo -e "   2. Deploy: ./scripts/deploy.sh"
else
    echo -e "${YELLOW}Terraform apply cancelled.${NC}"
fi 
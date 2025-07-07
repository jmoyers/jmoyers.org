provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "jmoyers-org"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# CloudFront requires certificates to be in us-east-1
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project     = "jmoyers-org"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
} 
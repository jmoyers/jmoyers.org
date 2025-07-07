variable "aws_region" {
  description = "AWS region for infrastructure"
  type        = string
  default     = "us-west-2"
}

variable "domain_name" {
  description = "Domain name for the website"
  type        = string
  default     = "jmoyers.org"
}

variable "create_route53_zone" {
  description = "Whether to create a new Route53 hosted zone"
  type        = bool
  default     = false
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "cloudfront_price_class" {
  description = "CloudFront price class (PriceClass_All, PriceClass_200, PriceClass_100)"
  type        = string
  default     = "PriceClass_100"
}

variable "project_name" {
  description = "Project name for resource tagging"
  type        = string
  default     = "jmoyers-org"
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "default_cache_ttl" {
  description = "Default cache TTL for CloudFront (in seconds)"
  type        = number
  default     = 3600
}

variable "static_cache_ttl" {
  description = "Cache TTL for static assets (in seconds)"
  type        = number
  default     = 31536000
} 
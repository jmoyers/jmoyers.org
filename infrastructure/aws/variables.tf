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

variable "wait_for_certificate_validation" {
  description = "Whether to wait for ACM certificate validation to complete"
  type        = bool
  default     = false
}

variable "monthly_budget_limit" {
  description = "Monthly budget limit in USD for cost alerts"
  type        = number
  default     = 50
}

variable "budget_alert_email" {
  description = "Email address for budget alerts"
  type        = string
  default     = ""
}

variable "budget_alert_phone" {
  description = "Phone number for budget SMS alerts (format: +1-555-123-4567)"
  type        = string
  default     = ""
}

variable "enable_cost_monitoring" {
  description = "Enable cost monitoring with budgets and alarms"
  type        = bool
  default     = true
} 
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
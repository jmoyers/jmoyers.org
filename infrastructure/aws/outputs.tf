output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket
}

output "s3_bucket_website_endpoint" {
  description = "Website endpoint for the S3 bucket"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_url" {
  description = "CloudFront distribution URL"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "certificate_arn" {
  description = "ACM certificate ARN"
  value       = aws_acm_certificate.website.arn
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID (if created)"
  value       = var.create_route53_zone ? aws_route53_zone.website[0].zone_id : null
}

output "route53_name_servers" {
  description = "Route53 name servers (if created)"
  value       = var.create_route53_zone ? aws_route53_zone.website[0].name_servers : null
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
} 
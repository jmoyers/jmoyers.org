# Route53 hosted zone (optional - for DNS migration)
resource "aws_route53_zone" "website" {
  count = var.create_route53_zone ? 1 : 0
  name  = var.domain_name
}

# A record for apex domain
resource "aws_route53_record" "website" {
  count   = var.create_route53_zone ? 1 : 0
  zone_id = aws_route53_zone.website[0].zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# A record for www subdomain
resource "aws_route53_record" "www" {
  count   = var.create_route53_zone ? 1 : 0
  zone_id = aws_route53_zone.website[0].zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.website.domain_name
    zone_id                = aws_cloudfront_distribution.website.hosted_zone_id
    evaluate_target_health = false
  }
}

# Certificate validation records
resource "aws_route53_record" "website_validation" {
  for_each = var.create_route53_zone ? {
    for dvo in aws_acm_certificate.website.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  } : {}

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.website[0].zone_id
}

# Certificate validation
# This resource waits for the certificate to be validated
# Set wait_for_certificate_validation = false to skip waiting
resource "aws_acm_certificate_validation" "website" {
  count           = var.create_route53_zone && var.wait_for_certificate_validation ? 1 : 0
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.website.arn
  validation_record_fqdns = [for record in aws_route53_record.website_validation : record.fqdn]
  
  timeouts {
    create = "45m"
  }
} 
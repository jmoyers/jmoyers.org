# Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "website" {
  name                              = var.domain_name
  description                       = "Origin Access Control for ${var.domain_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront function to handle directory URLs
resource "aws_cloudfront_function" "index_redirect" {
  name    = "${replace(var.domain_name, ".", "-")}-index-redirect"
  runtime = "cloudfront-js-2.0"
  comment = "Redirect directory URLs to index.html"
  publish = true
  code    = <<-EOT
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // Check if the URI ends with a slash (directory)
    if (uri.endsWith('/')) {
        request.uri = uri + 'index.html';
    }
    // Check if the URI is a directory without trailing slash
    else if (!uri.includes('.')) {
        request.uri = uri + '/index.html';
    }
    
    return request;
}
EOT
}

# ACM Certificate for CloudFront (must be in us-east-1)
resource "aws_acm_certificate" "website" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "website" {
  origin {
    domain_name              = aws_s3_bucket.website.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.website.id
    origin_id                = "S3-${aws_s3_bucket.website.bucket}"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  comment             = "CloudFront distribution for ${var.domain_name}"

  aliases = [var.domain_name, "www.${var.domain_name}"]

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.website.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    # Attach the CloudFront function to handle directory URLs
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.index_redirect.arn
    }

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = 0
    default_ttl = var.default_cache_ttl
    max_ttl     = 86400
  }

  # Cache behavior for static assets
  ordered_cache_behavior {
    path_pattern           = "/css/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.website.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = var.static_cache_ttl  # 1 year
    default_ttl = var.static_cache_ttl  # 1 year
    max_ttl     = var.static_cache_ttl  # 1 year
  }

  # Cache behavior for images
  ordered_cache_behavior {
    path_pattern           = "/image/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.website.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = var.static_cache_ttl  # 1 year
    default_ttl = var.static_cache_ttl  # 1 year
    max_ttl     = var.static_cache_ttl  # 1 year
  }

  # Cache behavior for fonts
  ordered_cache_behavior {
    path_pattern           = "/font/*"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.website.bucket}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    min_ttl     = var.static_cache_ttl  # 1 year
    default_ttl = var.static_cache_ttl  # 1 year
    max_ttl     = var.static_cache_ttl  # 1 year
  }

  price_class = var.cloudfront_price_class  # Use only US, Canada and Europe by default

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.website.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  # Custom error pages
  custom_error_response {
    error_code         = 404
    response_code      = 404
    response_page_path = "/404.html"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 404
    response_page_path = "/404.html"
  }
} 
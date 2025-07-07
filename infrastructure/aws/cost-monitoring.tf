# SNS Topic for cost alerts
resource "aws_sns_topic" "cost_alerts" {
  count = var.enable_cost_monitoring ? 1 : 0
  name  = "${var.project_name}-cost-alerts"
}

# SNS Topic subscription for email alerts
resource "aws_sns_topic_subscription" "cost_email_alerts" {
  count     = var.enable_cost_monitoring && var.budget_alert_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.cost_alerts[0].arn
  protocol  = "email"
  endpoint  = var.budget_alert_email
}

# SNS Topic subscription for SMS alerts
resource "aws_sns_topic_subscription" "cost_sms_alerts" {
  count     = var.enable_cost_monitoring && var.budget_alert_phone != "" ? 1 : 0
  topic_arn = aws_sns_topic.cost_alerts[0].arn
  protocol  = "sms"
  endpoint  = var.budget_alert_phone
}

# Monthly budget with multiple alert thresholds
resource "aws_budgets_budget" "monthly_budget" {
  count         = var.enable_cost_monitoring ? 1 : 0
  name          = "${var.project_name}-monthly-budget"
  budget_type   = "COST"
  limit_amount  = var.monthly_budget_limit
  limit_unit    = "USD"
  time_unit     = "MONTHLY"
  time_period_start = "2024-01-01_00:00"

  cost_filter {
    name   = "Service"
    values = [
      "Amazon Simple Storage Service",
      "Amazon CloudFront",
      "Amazon Route 53",
      "AWS Certificate Manager"
    ]
  }

  # Alert at 50% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 50
    threshold_type            = "PERCENTAGE"
    notification_type         = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_email != "" ? [var.budget_alert_email] : []
  }

  # Alert at 80% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 80
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_email != "" ? [var.budget_alert_email] : []
  }

  # Alert at 100% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_email != "" ? [var.budget_alert_email] : []
  }

  # Forecasted alert at 90% of budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 90
    threshold_type            = "PERCENTAGE"
    notification_type          = "FORECASTED"
    subscriber_email_addresses = var.budget_alert_email != "" ? [var.budget_alert_email] : []
  }
}

# CloudWatch Alarm for CloudFront data transfer (viral protection)
resource "aws_cloudwatch_metric_alarm" "cloudfront_data_transfer" {
  count               = var.enable_cost_monitoring ? 1 : 0
  alarm_name          = "${var.project_name}-cloudfront-high-data-transfer"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "BytesDownloaded"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10737418240"  # 10 GB in 5 minutes
  alarm_description   = "This metric monitors CloudFront data transfer - potential viral traffic"
  alarm_actions       = var.budget_alert_email != "" ? [aws_sns_topic.cost_alerts[0].arn] : []

  dimensions = {
    DistributionId = aws_cloudfront_distribution.website.id
  }
}

# CloudWatch Alarm for CloudFront requests (viral protection)
resource "aws_cloudwatch_metric_alarm" "cloudfront_requests" {
  count               = var.enable_cost_monitoring ? 1 : 0
  alarm_name          = "${var.project_name}-cloudfront-high-requests"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "Requests"
  namespace           = "AWS/CloudFront"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10000"  # 10k requests in 5 minutes
  alarm_description   = "This metric monitors CloudFront requests - potential viral traffic"
  alarm_actions       = var.budget_alert_email != "" ? [aws_sns_topic.cost_alerts[0].arn] : []

  dimensions = {
    DistributionId = aws_cloudfront_distribution.website.id
  }
}

# Daily budget for viral protection
resource "aws_budgets_budget" "daily_viral_budget" {
  count         = var.enable_cost_monitoring ? 1 : 0
  name          = "${var.project_name}-daily-viral-protection"
  budget_type   = "COST"
  limit_amount  = var.monthly_budget_limit / 10  # 10% of monthly budget per day
  limit_unit    = "USD"
  time_unit     = "DAILY"
  time_period_start = "2024-01-01_00:00"

  cost_filter {
    name   = "Service"
    values = [
      "Amazon CloudFront"
    ]
  }

  # Alert at 100% of daily budget
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                 = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.budget_alert_email != "" ? [var.budget_alert_email] : []
  }
} 
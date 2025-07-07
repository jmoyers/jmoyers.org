#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import inquirer from "inquirer";
import { config } from "dotenv";
import { execa } from "execa";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Load environment variables
config({ path: ".env.local", quiet: true });

interface EnvConfig {
  AWS_REGION?: string;
  AWS_PROFILE?: string;
  DOMAIN_NAME?: string;
  CLOUDFRONT_DISTRIBUTION_ID?: string;
  S3_BUCKET_NAME?: string;
  CREATE_ROUTE53_ZONE?: string;
  ENVIRONMENT?: string;
  CLOUDFRONT_PRICE_CLASS?: string;
  PROJECT_NAME?: string;
  ENABLE_VERSIONING?: string;
  DEFAULT_CACHE_TTL?: string;
  STATIC_CACHE_TTL?: string;
}

class JMoyersOrgCLI {
  private envConfig: EnvConfig = {};
  private envPath = ".env.local";
  private terraformDir = "infrastructure/aws";

  constructor() {
    this.loadEnvConfig();
  }

  private loadEnvConfig(): void {
    if (existsSync(this.envPath)) {
      const envContent = readFileSync(this.envPath, "utf-8");
      const lines = envContent.split("\n");

      for (const line of lines) {
        if (line.trim() && !line.startsWith("#")) {
          const [key, value] = line.split("=");
          if (key && value) {
            this.envConfig[key.trim() as keyof EnvConfig] = value.trim();
          }
        }
      }
    }
  }

  private checkEnvFile(): boolean {
    if (!existsSync(this.envPath)) {
      console.log(chalk.red("❌ .env.local not found"));
      console.log(
        chalk.yellow("💡 Copy env.template to .env.local and configure it:")
      );
      console.log(chalk.cyan("   cp env.template .env.local"));
      return false;
    }
    return true;
  }

  private async runCommand(
    command: string,
    args: string[],
    options?: { cwd?: string }
  ): Promise<void> {
    const spinner = ora(`Running: ${command} ${args.join(" ")}`).start();
    let childProcess: any = null;
    let isInterrupted = false;
    let interruptCount = 0;

    // Handle interrupts gracefully
    const handleInterrupt = () => {
      interruptCount++;

      if (interruptCount === 1) {
        isInterrupted = true;
        spinner.warn(
          chalk.yellow(
            "🔄 Received interrupt signal, attempting graceful cancellation..."
          )
        );
        console.log(
          chalk.yellow(
            "💡 Press Ctrl+C again to force exit (may cause data loss)"
          )
        );

        if (childProcess) {
          // Send SIGTERM first for graceful shutdown
          childProcess.kill("SIGTERM");

          // If it doesn't respond in 10 seconds, send SIGKILL
          setTimeout(() => {
            if (!childProcess.killed) {
              childProcess.kill("SIGKILL");
            }
          }, 10000);
        }
      } else if (interruptCount >= 2) {
        spinner.fail(chalk.red("❌ Force exit requested"));
        console.log(
          chalk.red("⚠️  Forcing immediate exit - data loss may occur!")
        );
        process.exit(130); // Standard exit code for Ctrl+C
      }
    };

    // Add interrupt handlers
    process.on("SIGINT", handleInterrupt);
    process.on("SIGTERM", handleInterrupt);

    try {
      childProcess = execa(command, args, {
        cwd: options?.cwd,
        stdio: "inherit",
        env: {
          ...process.env,
          ...this.getTerraformEnvVars(),
        },
      });

      await childProcess;

      if (isInterrupted) {
        spinner.warn(chalk.yellow("⚠️  Command was cancelled"));
        throw new Error("Command cancelled by user");
      } else {
        spinner.succeed(chalk.green(`✅ ${command} completed successfully`));
      }
    } catch (error: any) {
      if (isInterrupted) {
        spinner.warn(chalk.yellow("⚠️  Command was cancelled gracefully"));
        throw new Error("Command cancelled by user");
      } else if (error.isCanceled) {
        spinner.warn(chalk.yellow("⚠️  Command was cancelled"));
        throw new Error("Command cancelled");
      } else {
        spinner.fail(chalk.red(`❌ ${command} failed`));
        throw error;
      }
    } finally {
      // Remove interrupt handlers
      process.removeListener("SIGINT", handleInterrupt);
      process.removeListener("SIGTERM", handleInterrupt);
    }
  }

  private getTerraformEnvVars(): Record<string, string> {
    const envVars: Record<string, string> = {};

    if (this.envConfig.AWS_REGION) {
      envVars.TF_VAR_aws_region = this.envConfig.AWS_REGION;
    }

    if (this.envConfig.DOMAIN_NAME) {
      envVars.TF_VAR_domain_name = this.envConfig.DOMAIN_NAME;
    }

    if (this.envConfig.CREATE_ROUTE53_ZONE) {
      envVars.TF_VAR_create_route53_zone = this.envConfig.CREATE_ROUTE53_ZONE;
    }

    if (this.envConfig.ENVIRONMENT) {
      envVars.TF_VAR_environment = this.envConfig.ENVIRONMENT;
    }

    if (this.envConfig.CLOUDFRONT_PRICE_CLASS) {
      envVars.TF_VAR_cloudfront_price_class =
        this.envConfig.CLOUDFRONT_PRICE_CLASS;
    }

    if (this.envConfig.PROJECT_NAME) {
      envVars.TF_VAR_project_name = this.envConfig.PROJECT_NAME;
    }

    if (this.envConfig.ENABLE_VERSIONING) {
      envVars.TF_VAR_enable_versioning = this.envConfig.ENABLE_VERSIONING;
    }

    if (this.envConfig.DEFAULT_CACHE_TTL) {
      envVars.TF_VAR_default_cache_ttl = this.envConfig.DEFAULT_CACHE_TTL;
    }

    if (this.envConfig.STATIC_CACHE_TTL) {
      envVars.TF_VAR_static_cache_ttl = this.envConfig.STATIC_CACHE_TTL;
    }

    if (this.envConfig.AWS_PROFILE) {
      envVars.AWS_PROFILE = this.envConfig.AWS_PROFILE;
    }

    return envVars;
  }

  async deployInfrastructure(): Promise<void> {
    console.log(chalk.blue("🚀 Deploying AWS Infrastructure"));

    if (!this.checkEnvFile()) {
      return;
    }

    // Show configuration
    console.log(chalk.cyan("\n📋 Configuration:"));
    console.log(
      `   AWS Region: ${chalk.green(
        this.envConfig.AWS_REGION || "us-west-2 (default)"
      )}`
    );
    console.log(
      `   Domain: ${chalk.green(this.envConfig.DOMAIN_NAME || "jmoyers.org")}`
    );
    console.log(
      `   Route53: ${chalk.green(
        this.envConfig.CREATE_ROUTE53_ZONE === "true" ? "Yes" : "No"
      )}`
    );
    console.log(
      `   AWS Profile: ${chalk.green(this.envConfig.AWS_PROFILE || "default")}`
    );

    // Check if Terraform is initialized
    const terraformInitialized = existsSync(
      resolve(this.terraformDir, ".terraform")
    );

    if (!terraformInitialized) {
      console.log(chalk.yellow("\n🔧 Initializing Terraform..."));
      await this.runCommand("terraform", ["init"], { cwd: this.terraformDir });
    }

    // Run terraform plan
    console.log(chalk.yellow("\n📋 Running Terraform plan..."));
    await this.runCommand("terraform", ["plan"], { cwd: this.terraformDir });

    // Ask for confirmation
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "Do you want to apply these changes?",
        default: false,
      },
    ]);

    if (!confirm) {
      console.log(chalk.yellow("❌ Deployment cancelled"));
      return;
    }

    // Apply changes
    console.log(chalk.yellow("\n🚀 Applying Terraform changes..."));
    await this.runCommand("terraform", ["apply", "-auto-approve"], {
      cwd: this.terraformDir,
    });

    console.log(chalk.green("\n✅ Infrastructure deployed successfully!"));

    // Auto-update .env.local after successful deployment
    console.log(
      chalk.cyan(
        "\n🔄 Automatically updating .env.local with Terraform outputs..."
      )
    );
    try {
      await this.updateEnvFromTerraform();
      console.log(
        chalk.green("✅ Environment variables updated automatically!")
      );
      console.log(
        chalk.cyan("💡 Next step: Run 'yarn cli deploy' to deploy your site")
      );
    } catch (error: any) {
      console.log(
        chalk.yellow("⚠️  Failed to auto-update .env.local:"),
        error.message
      );
      console.log(chalk.cyan("💡 You can manually run: yarn cli update-env"));
      console.log(chalk.cyan("💡 Then run: yarn cli deploy"));
    }
  }

  async updateEnvFromTerraform(): Promise<void> {
    console.log(chalk.blue("🔄 Updating .env.local from Terraform outputs"));

    if (!existsSync(resolve(this.terraformDir, "terraform.tfstate"))) {
      console.log(
        chalk.red("❌ Terraform state not found. Deploy infrastructure first.")
      );
      return;
    }

    const spinner = ora("Fetching Terraform outputs").start();

    try {
      const { stdout } = await execa("terraform", ["output", "-json"], {
        cwd: this.terraformDir,
        env: this.getTerraformEnvVars(),
      });

      const outputs = JSON.parse(stdout);

      // Create backup
      if (existsSync(this.envPath)) {
        const backup = `${this.envPath}.backup.${Date.now()}`;
        writeFileSync(backup, readFileSync(this.envPath));
        console.log(chalk.gray(`📋 Backup created: ${backup}`));
      }

      // Update environment variables
      let envContent = existsSync(this.envPath)
        ? readFileSync(this.envPath, "utf-8")
        : "";
      const updates: Record<string, string> = {};

      if (outputs.cloudfront_distribution_id?.value) {
        updates.CLOUDFRONT_DISTRIBUTION_ID =
          outputs.cloudfront_distribution_id.value;
      }

      if (outputs.s3_bucket_name?.value) {
        updates.S3_BUCKET_NAME = outputs.s3_bucket_name.value;
      }

      if (outputs.cloudfront_url?.value) {
        updates.CLOUDFRONT_DOMAIN_NAME = outputs.cloudfront_url.value;
      }

      if (outputs.certificate_arn?.value) {
        updates.CERTIFICATE_ARN = outputs.certificate_arn.value;
      }

      if (outputs.route53_zone_id?.value) {
        updates.ROUTE53_ZONE_ID = outputs.route53_zone_id.value;
      }

      // Update or add variables
      for (const [key, value] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, "m");
        if (envContent.match(regex)) {
          envContent = envContent.replace(regex, `${key}=${value}`);
        } else {
          envContent += `\n${key}=${value}`;
        }
      }

      writeFileSync(this.envPath, envContent);

      spinner.succeed(chalk.green("✅ Environment variables updated"));

      console.log(chalk.cyan("\n📋 Updated variables:"));
      for (const [key, value] of Object.entries(updates)) {
        console.log(`   ${key}: ${chalk.green(value)}`);
      }
    } catch (error) {
      spinner.fail(chalk.red("❌ Failed to update environment variables"));
      throw error;
    }
  }

  async deployWebsite(): Promise<void> {
    console.log(chalk.blue("🚀 Deploying website"));

    if (!this.checkEnvFile()) {
      return;
    }

    if (!this.envConfig.CLOUDFRONT_DISTRIBUTION_ID) {
      console.log(chalk.yellow("⚠️  CLOUDFRONT_DISTRIBUTION_ID not found"));
      console.log(chalk.cyan("💡 Run: jmoyers update-env"));

      const { continueWithoutCache } = await inquirer.prompt([
        {
          type: "confirm",
          name: "continueWithoutCache",
          message: "Continue without CloudFront cache invalidation?",
          default: false,
        },
      ]);

      if (!continueWithoutCache) {
        return;
      }
    }

    // Build the site
    console.log(chalk.yellow("\n🔨 Building site..."));
    await this.runCommand("yarn", ["build"]);

    // Deploy to S3
    const bucketName =
      this.envConfig.S3_BUCKET_NAME ||
      this.envConfig.DOMAIN_NAME ||
      "jmoyers.org";
    const awsRegion = this.envConfig.AWS_REGION || "us-west-2";

    console.log(chalk.yellow(`\n☁️  Syncing to S3 (region: ${awsRegion})...`));

    // Sync static assets with long cache headers
    await this.runCommand("aws", [
      "s3",
      "sync",
      "dist/",
      `s3://${bucketName}/`,
      "--region",
      awsRegion,
      "--exclude",
      "*.html",
      "--exclude",
      "*.xml",
      "--exclude",
      "*.txt",
      "--cache-control",
      "public, max-age=31536000, immutable",
      "--delete",
    ]);

    // Sync HTML files with short cache headers
    await this.runCommand("aws", [
      "s3",
      "sync",
      "dist/",
      `s3://${bucketName}/`,
      "--region",
      awsRegion,
      "--exclude",
      "*",
      "--include",
      "*.html",
      "--include",
      "*.xml",
      "--include",
      "*.txt",
      "--cache-control",
      "public, max-age=300",
      "--delete",
    ]);

    // Set special cache headers for index.html
    await this.runCommand("aws", [
      "s3",
      "cp",
      "dist/index.html",
      `s3://${bucketName}/index.html`,
      "--region",
      awsRegion,
      "--cache-control",
      "public, max-age=0, must-revalidate",
    ]);

    // Set cache headers for 404.html
    await this.runCommand("aws", [
      "s3",
      "cp",
      "dist/404.html",
      `s3://${bucketName}/404.html`,
      "--region",
      awsRegion,
      "--cache-control",
      "public, max-age=300",
    ]);

    // Invalidate CloudFront cache
    if (this.envConfig.CLOUDFRONT_DISTRIBUTION_ID) {
      console.log(chalk.yellow("\n🔄 Invalidating CloudFront cache..."));

      const { stdout: invalidationId } = await execa("aws", [
        "cloudfront",
        "create-invalidation",
        "--distribution-id",
        this.envConfig.CLOUDFRONT_DISTRIBUTION_ID,
        "--paths",
        "/*",
        "--query",
        "Invalidation.Id",
        "--output",
        "text",
      ]);

      console.log(chalk.green(`✅ Invalidation created: ${invalidationId}`));

      const spinner = ora("Waiting for invalidation to complete...").start();

      try {
        await execa("aws", [
          "cloudfront",
          "wait",
          "invalidation-completed",
          "--distribution-id",
          this.envConfig.CLOUDFRONT_DISTRIBUTION_ID,
          "--id",
          invalidationId,
        ]);

        spinner.succeed(chalk.green("✅ Cache invalidation completed"));
      } catch (error) {
        spinner.warn(
          chalk.yellow("⚠️  Cache invalidation taking longer than expected")
        );
      }
    }

    console.log(chalk.green("\n🎉 Deployment completed successfully!"));
    console.log(chalk.cyan(`🌐 Site available at: https://${bucketName}`));
  }

  async showStatus(): Promise<void> {
    console.log(chalk.blue("📊 jmoyers.org Status"));

    console.log(chalk.cyan("\n🔧 Configuration:"));
    console.log(
      `   .env.local: ${
        existsSync(this.envPath) ? chalk.green("✅") : chalk.red("❌")
      }`
    );
    console.log(
      `   AWS Region: ${chalk.green(
        this.envConfig.AWS_REGION || "us-west-2 (default)"
      )}`
    );
    console.log(
      `   Domain: ${chalk.green(this.envConfig.DOMAIN_NAME || "jmoyers.org")}`
    );
    console.log(
      `   AWS Profile: ${chalk.green(this.envConfig.AWS_PROFILE || "default")}`
    );

    console.log(chalk.cyan("\n☁️  Infrastructure:"));
    const terraformInitialized = existsSync(
      resolve(this.terraformDir, ".terraform")
    );
    const terraformState = existsSync(
      resolve(this.terraformDir, "terraform.tfstate")
    );

    console.log(
      `   Terraform initialized: ${
        terraformInitialized ? chalk.green("✅") : chalk.red("❌")
      }`
    );
    console.log(
      `   Infrastructure deployed: ${
        terraformState ? chalk.green("✅") : chalk.red("❌")
      }`
    );
    console.log(
      `   CloudFront ID: ${
        this.envConfig.CLOUDFRONT_DISTRIBUTION_ID
          ? chalk.green("✅")
          : chalk.red("❌")
      }`
    );
    console.log(
      `   Route53 enabled: ${
        this.envConfig.CREATE_ROUTE53_ZONE === "true"
          ? chalk.green("✅")
          : chalk.yellow("❌")
      }`
    );

    console.log(chalk.cyan("\n🏗️  Build:"));
    const distExists = existsSync("dist");
    console.log(
      `   Site built: ${distExists ? chalk.green("✅") : chalk.red("❌")}`
    );

    if (distExists) {
      try {
        const { stdout } = await execa(
          "find",
          ["dist", "-type", "f", "|", "wc", "-l"],
          { shell: true }
        );
        console.log(`   Files in dist: ${chalk.green(stdout.trim())}`);
      } catch (error) {
        // Ignore error
      }
    }
  }

  async runTerraform(args: string[]): Promise<void> {
    console.log(chalk.blue("🔧 Running Terraform with environment variables"));

    if (!this.checkEnvFile()) {
      return;
    }

    // Show environment being used
    console.log(chalk.cyan("\n📋 Using configuration:"));
    console.log(
      `   AWS Region: ${chalk.green(
        this.envConfig.AWS_REGION || "us-west-2 (default)"
      )}`
    );
    console.log(
      `   Domain: ${chalk.green(this.envConfig.DOMAIN_NAME || "jmoyers.org")}`
    );
    if (this.envConfig.AWS_PROFILE) {
      console.log(`   AWS Profile: ${chalk.green(this.envConfig.AWS_PROFILE)}`);
    }

    // Check if this is an apply command
    const isApply = args.length > 0 && args[0] === "apply";
    const isAutoApprove = args.includes("-auto-approve");

    // Execute terraform with all environment variables
    try {
      const result = await execa("terraform", args, {
        cwd: this.terraformDir,
        stdio: "inherit",
        env: {
          ...process.env,
          ...this.getTerraformEnvVars(),
        },
      });

      console.log(chalk.green("\n✅ Terraform command completed successfully"));

      // Auto-update .env.local after successful apply
      if (isApply) {
        console.log(
          chalk.cyan(
            "\n🔄 Automatically updating .env.local with Terraform outputs..."
          )
        );
        try {
          await this.updateEnvFromTerraform();
          console.log(
            chalk.green("✅ Environment variables updated automatically!")
          );
          console.log(
            chalk.cyan(
              "💡 Next step: Run 'yarn cli deploy' to deploy your site"
            )
          );
        } catch (error: any) {
          console.log(
            chalk.yellow("⚠️  Failed to auto-update .env.local:"),
            error.message
          );
          console.log(
            chalk.cyan("💡 You can manually run: yarn cli update-env")
          );
        }
      }
    } catch (error: any) {
      console.log(chalk.red("\n❌ Terraform command failed"));
      throw error;
    }
  }

  async listConfigurableVars(): Promise<void> {
    console.log(chalk.blue("⚙️  Configurable Variables"));

    const variables = [
      {
        name: "AWS_REGION",
        description: "AWS region for infrastructure and deployment",
        required: true,
        current: this.envConfig.AWS_REGION,
        default: "us-west-2",
        terraformVar: "TF_VAR_aws_region",
      },
      {
        name: "DOMAIN_NAME",
        description: "Your domain name",
        required: true,
        current: this.envConfig.DOMAIN_NAME,
        default: "jmoyers.org",
        terraformVar: "TF_VAR_domain_name",
      },
      {
        name: "AWS_PROFILE",
        description: "AWS CLI profile to use (alternative to access keys)",
        required: false,
        current: this.envConfig.AWS_PROFILE,
        default: "default",
      },
      {
        name: "CREATE_ROUTE53_ZONE",
        description: "Whether to create Route53 hosted zone for DNS",
        required: false,
        current: this.envConfig.CREATE_ROUTE53_ZONE,
        default: "false",
        terraformVar: "TF_VAR_create_route53_zone",
      },
      {
        name: "ENVIRONMENT",
        description: "Environment name for resource tagging",
        required: false,
        current: this.envConfig.ENVIRONMENT,
        default: "production",
        terraformVar: "TF_VAR_environment",
      },
      {
        name: "CLOUDFRONT_PRICE_CLASS",
        description:
          "CloudFront price class (PriceClass_100, PriceClass_200, PriceClass_All)",
        required: false,
        current: this.envConfig.CLOUDFRONT_PRICE_CLASS,
        default: "PriceClass_100",
        terraformVar: "TF_VAR_cloudfront_price_class",
      },
      {
        name: "PROJECT_NAME",
        description: "Project name for resource tagging",
        required: false,
        current: this.envConfig.PROJECT_NAME,
        default: "jmoyers-org",
        terraformVar: "TF_VAR_project_name",
      },
      {
        name: "ENABLE_VERSIONING",
        description: "Enable S3 bucket versioning (true/false)",
        required: false,
        current: this.envConfig.ENABLE_VERSIONING,
        default: "true",
        terraformVar: "TF_VAR_enable_versioning",
      },
      {
        name: "DEFAULT_CACHE_TTL",
        description: "Default cache TTL for CloudFront (in seconds)",
        required: false,
        current: this.envConfig.DEFAULT_CACHE_TTL,
        default: "3600",
        terraformVar: "TF_VAR_default_cache_ttl",
      },
      {
        name: "STATIC_CACHE_TTL",
        description: "Cache TTL for static assets (in seconds)",
        required: false,
        current: this.envConfig.STATIC_CACHE_TTL,
        default: "31536000",
        terraformVar: "TF_VAR_static_cache_ttl",
      },
    ];

    console.log(chalk.cyan("\n📋 Variables you can configure in .env.local:"));

    for (const variable of variables) {
      const status = variable.current
        ? chalk.green("✅")
        : variable.required
        ? chalk.red("❌")
        : chalk.yellow("⚪");
      console.log(
        `\n   ${status} ${chalk.bold(variable.name)} ${
          variable.required ? chalk.red("(required)") : chalk.gray("(optional)")
        }`
      );
      console.log(`      ${chalk.gray(variable.description)}`);
      console.log(
        `      Current: ${
          variable.current
            ? chalk.green(variable.current)
            : chalk.gray("not set")
        }`
      );
      console.log(`      Default: ${chalk.gray(variable.default)}`);
      if (variable.terraformVar) {
        console.log(`      Terraform: ${chalk.blue(variable.terraformVar)}`);
      }
    }

    console.log(
      chalk.cyan("\n🤖 Auto-populated variables (from Terraform outputs):")
    );
    const autoVars = [
      "CLOUDFRONT_DISTRIBUTION_ID",
      "S3_BUCKET_NAME",
      "CLOUDFRONT_DOMAIN_NAME",
      "CERTIFICATE_ARN",
      "ROUTE53_ZONE_ID",
    ];

    for (const varName of autoVars) {
      const current = this.envConfig[varName as keyof EnvConfig];
      const status = current ? chalk.green("✅") : chalk.gray("⚪");
      console.log(
        `   ${status} ${varName}: ${
          current ? chalk.green(current) : chalk.gray("not set")
        }`
      );
    }
  }

  async init(): Promise<void> {
    const program = new Command();

    program
      .name("jmoyers")
      .description(
        "CLI tool for managing jmoyers.org infrastructure and deployment"
      )
      .version("1.0.0");

    program
      .command("deploy-infra")
      .description(
        "Deploy AWS infrastructure using Terraform (auto-updates .env.local)"
      )
      .action(() => this.deployInfrastructure());

    program
      .command("update-env")
      .description("Update .env.local with Terraform outputs")
      .action(() => this.updateEnvFromTerraform());

    program
      .command("deploy")
      .description("Deploy website to S3 and invalidate CloudFront cache")
      .action(() => this.deployWebsite());

    program
      .command("status")
      .description("Show current status of configuration and infrastructure")
      .action(() => this.showStatus());

    program
      .command("config")
      .description("List all configurable variables")
      .action(() => this.listConfigurableVars());

    program
      .command("terraform [args...]")
      .description(
        "Run terraform commands with environment variables (auto-updates .env.local after apply)"
      )
      .allowUnknownOption()
      .action((args: string[]) => {
        return this.runTerraform(args || []);
      });

    await program.parseAsync(process.argv);
  }
}

// Run the CLI
const cli = new JMoyersOrgCLI();
cli.init().catch((error) => {
  console.error(chalk.red("❌ Error:"), error.message);
  process.exit(1);
});

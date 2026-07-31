
terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "6.0.0" # Compatible with Terraform 1.5.x
    }
  }
}

# Configure the GitHub Provider
provider "github" {
  owner = "tatekitzhak" # GitHub Organization or User
}

# Define local secrets map
locals {
  repo_name = "kc_frontend_spinwheel"

  secrets = {
    API_URL                        = var.api_url
    AWS_EC2_INSTANCE_NAME          = var.aws_ec2_instance_name
    AWS_REGION                     = var.aws_region
    AWS_ROLE                       = var.aws_role

    DOCKER_PASSWORD                = var.docker_password
    DOCKER_USERNAME                = var.docker_hub_username
    FRONTEND_REPOSITORY_NAME       = var.frontend_repository_name

    VITE_EXPRESS_JS_REST_API_URL   = var.vite_express_js_rest_api_url
    VITE_KC_ADMIN_CONSOLE_API_URL  = var.vite_kc_admin_console_api_url
    VITE_KC_ADMIN_CONSOLE_CLIENT_ID = var.vite_kc_admin_console_client_id
    VITE_KC_ADMIN_CONSOLE_PORT     = var.vite_kc_admin_console_port
    VITE_KC_ADMIN_CONSOLE_REAL_NAME = var.vite_kc_admin_console_real_name
  }
}

# Loop through map to create secrets
resource "github_actions_secret" "repo_secrets" {
  for_each        = local.secrets
  repository      = local.repo_name
  secret_name     = each.key
  plaintext_value = each.value
}

# --- Variables ---

variable "docker_hub_username" {
  type        = string
  description = "Docker Hub username"
}

variable "docker_password" {
  type        = string
  description = "Docker Hub access password or token"
  sensitive   = true
}

variable "api_url" {
  type        = string
  description = "API endpoint URL"
}

variable "aws_ec2_instance_name" {
  type        = string
  description = "Name of the AWS EC2 instance"
}

variable "aws_region" {
  type        = string
  description = "AWS region for deployment"
}

variable "aws_role" {
  type        = string
  description = "AWS IAM role to be assumed or attached"
}

variable "frontend_repository_name" {
  type        = string
  description = "Name of the frontend repository"
}

variable "vite_express_js_rest_api_url" {
  type        = string
  description = "Vite Express JS REST API URL"
}

variable "vite_kc_admin_console_api_url" {
  type        = string
  description = "Keycloak Admin Console API URL"
}

variable "vite_kc_admin_console_client_id" {
  type        = string
  description = "Keycloak Admin Console client ID"
}

variable "vite_kc_admin_console_port" {
  type        = string
  description = "Keycloak Admin Console port"
}

variable "vite_kc_admin_console_real_name" {
  type        = string
  description = "Keycloak Admin Console realm name"
}
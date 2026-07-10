terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  # For Linux/macOS, use unix socket. For Windows, use npipe:////./pipe/docker_engine
  host = "unix:///var/run/docker.sock"

  registry_auth {
    # address  = "registry.hub.docker.com"
    address  = "registry-1.docker.io"
    username = var.docker_hub_username
    password = var.docker_password # Use a Personal Access Token for security
  }
}

# Define the Docker Image to build
resource "docker_image" "webapp" {

  # Prefixing the name with your username is required for Docker Hub
  # name = "${var.docker_hub_username}/tr-kc-spindraw-image:v1"
  name = "registry-1.docker.io/${var.docker_hub_username}/tr-kc-spindraw-img:v1"
  build {
    context    = "../" # Look in the current directory for the Dockerfile
    dockerfile = "Dockerfile.frontend"
  }

}

# Create the Docker Container
resource "docker_container" "web_server" {
  name  = "tr-kc-spindraw-container"
  image = docker_image.webapp.image_id

  ports {
    internal = 443
    external = 4000 # This maps http://localhost:4000 to the container
  }

  healthcheck {
    # Inside the container, the app is likely listening on port 80/443 (your internal port). 
    # The healthcheck runs inside the container's network namespace
    # test     = ["CMD", "curl", "-f", "http://localhost:443"]
    # -k tells curl to trust your self-signed localhost.crt certificate
    test     = ["CMD", "curl", "-k", "-f", "https://localhost:443/nginx_health"]
    interval = "30s"
    timeout  = "10s"
    retries  = 3
  }
}

resource "docker_registry_image" "push_to_hub" {
  name = docker_image.webapp.name

  # Ensure the image is built before attempting to push
  keep_remotely = true
}

variable "docker_hub_username" {
  type        = string
  description = "Docker Hub username"
}

variable "docker_password" {
  type        = string
  description = "Docker Hub access password or token"
  sensitive   = true
}
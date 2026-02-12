# List of APIs required for your GKE + Gateway + Load Balancer setup
variable "gcp_service_list" {
  description = "The list of apis necessary for the project"
  type        = list(string)
  default = [
    "compute.googleapis.com",           # Networking & VMs
    "container.googleapis.com",         # GKE Cluster
    "apigateway.googleapis.com",        # API Gateway
    "servicemanagement.googleapis.com", # Gateway Management
    "servicecontrol.googleapis.com",    # Gateway Logging/Auth
    "iam.googleapis.com"                # Permissions
  ]
}

# Resource to enable the APIs
resource "google_project_service" "enabled_apis" {
  for_each = toset(var.gcp_service_list)
  project  = var.project_id
  service  = each.key

  # Crucial: Don't disable the API if you delete this resource 
  # (prevents accidental teardown of other things)
  disable_on_destroy = false
}
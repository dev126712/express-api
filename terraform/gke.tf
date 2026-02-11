resource "google_container_cluster" "primary" {
  name     = "express-api-cluster"
  location = "us-central1"

  # We create a small default node pool and delete it immediately
  # to manage node pools separately (best practice)
  remove_default_node_pool = true
  initial_node_count       = 1
  network                  = google_compute_network.main.id
  subnetwork               = google_compute_subnetwork.private.id

  private_cluster_config {
    enable_private_nodes    = true
    enable_private_endpoint = false # Keep the master public for kubectl access
    master_ipv4_cidr_block  = "172.16.0.0/28"
  }

  ip_allocation_policy {
    cluster_secondary_range_name  = "k8s-pod-range"
    services_secondary_range_name = "k8s-service-range"
  }

  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "/32"
      display_name = "Home-Office"
    }
  }
}

# Separately Managed Node Pool
resource "google_container_node_pool" "primary_nodes" {
  name       = "main-pool"
  location   = "us-central1"
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    machine_type    = "e2-medium"
    service_account = "default"
    oauth_scopes    = ["https://www.googleapis.com/auth/cloud-platform"]
  }
}

# VPC Network
resource "google_compute_network" "main" {
  name                    = "main-vpc"
  auto_create_subnetworks = false
}

# Private Subnet with Secondary Ranges for Pods and Services
resource "google_compute_subnetwork" "private" {
  name          = "private-subnet"
  ip_cidr_range = "10.0.0.0/18"
  region        = "us-central1"
  network       = google_compute_network.main.id

  secondary_ip_range {
    range_name    = "k8s-pod-range"
    ip_cidr_range = "10.48.0.0/14"
  }
  secondary_ip_range {
    range_name    = "k8s-service-range"
    ip_cidr_range = "10.52.0.0/20"
  }
}

# Cloud Router (Required for NAT)
resource "google_compute_router" "router" {
  name    = "router"
  region  = "us-central1"
  network = google_compute_network.main.id
}

# Cloud NAT Gateway
resource "google_compute_router_nat" "nat" {
  name                               = "nat"
  router                             = google_compute_router.router.name
  region                             = google_compute_router.router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}

resource "google_compute_subnetwork" "proxy_subnet" {
  name          = "proxy-only-subnet"
  ip_cidr_range = "10.129.0.0/23"
  network       = google_compute_network.main.id
  purpose       = "REGIONAL_MANAGED_PROXY"
  role          = "ACTIVE"
  region        = "us-central1"
}
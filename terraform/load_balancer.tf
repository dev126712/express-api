# Reserved Global Static IP
resource "google_compute_global_address" "lb_default_ip" {
  name = "lb-static-ip"
}

# Health Check to ensure GKE pods are alive
resource "google_compute_health_check" "default" {
  name = "gke-health-check"
  http_health_check {
    port = 80
  }
}

resource "google_compute_backend_service" "default" {
  name                  = "gke-backend-service"
  protocol              = "HTTP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  health_checks         = [google_compute_health_check.default.id]
}

# 4. URL Map (The "Brain" of the Load Balancer)
resource "google_compute_url_map" "default" {
  name            = "web-map"
  default_service = google_compute_backend_service.default.id
}

# 5. HTTP Proxy
resource "google_compute_target_http_proxy" "default" {
  name    = "http-proxy"
  url_map = google_compute_url_map.default.id
}

# 6. Global Forwarding Rule
resource "google_compute_global_forwarding_rule" "default" {
  name                  = "forwarding-rule"
  ip_address            = google_compute_global_address.lb_default_ip.address
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "80"
  target                = google_compute_target_http_proxy.default.id
}
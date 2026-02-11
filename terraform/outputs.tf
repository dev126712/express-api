output "load_balancer_public_ip" {
  description = "Point your domain's A record to this IP"
  value       = google_compute_global_address.lb_default_ip.address
}

output "api_gateway_hostname" {
  value = google_api_gateway_gateway.gw.default_hostname
}

output "nat_ip_status" {
  value = google_compute_router_nat.nat.nat_ip_allocate_option
}
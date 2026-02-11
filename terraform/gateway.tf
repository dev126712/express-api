# Note: The Gateway API is usually enabled via GKE Config
# This resource configures the Google Cloud API Gateway for external traffic
resource "google_api_gateway_api" "api_gw" {
  provider = google-beta
  api_id   = "my-gateway-api"

  depends_on = [google_project_service.enabled_apis]
}

resource "google_api_gateway_gateway" "gw" {
  provider   = google-beta
  gateway_id = "main-gateway"
  api_config = google_api_gateway_api_config.config.id
  region     = "us-central1"
}

resource "google_api_gateway_api_config" "config" {
  provider      = google-beta
  api           = google_api_gateway_api.api_gw.api_id
  api_config_id = "config"

  openapi_documents {
    document {
      path     = "spec.yaml"
      contents = filebase64("openapi_spec.yaml")
    }
  }
}

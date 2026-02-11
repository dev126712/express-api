variable "project_id" {
  description = "The GCP Project ID where resources will be deployed"
  type        = string
}

variable "region" {
  description = "The default GCP region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The default GCP zone"
  type        = string
  default     = "us-central1-a"
}

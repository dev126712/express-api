#!/usr/bin/env bash
set -e

Prometheus() {
    # Download and install Prometheus
    wget https://github.com/prometheus/prometheus/releases/download/v3.8.0/prometheus-3.8.0.linux-amd64.tar.gz
    tar -xvfz prometheus-3.8.0.linux-amd64.tar.gz
    rm prometheus-3.8.0.linux-amd64.tar.gz
    mv prometheus-3.8.0.linux-amd64 /prometheus
}

Blackbox_Exporter() {
    # Download and install Blackbox Exporter
    wget https://github.com/prometheus/blackbox_exporter/releases/download/v0.28.0/blackbox_exporter-0.28.0.linux-amd64.tar.gz
    tar -xvfz blackbox_exporter-0.28.0.linux-amd64.tar.gz
    rm blackbox_exporter-0.28.0.linux-amd64.tar.gz
    mv blackbox_exporter-0.28.0.linux-amd64 /blackbox_exporter
}
    
Alertmanager() {
    # Download and install Alertmanager
    wget https://github.com/prometheus/alertmanager/releases/download/v0.29.0/alertmanager-0.29.0.linux-amd64.tar.gz
    tar -xvfz alertmanager-0.29.0.linux-amd64.tar.gz
    rm alertmanager-0.29.0.linux-amd64.tar.gz
    mv alertmanager-0.29.0.linux-amd64 /alertmanager
}

main() {
    sudo apt update
    sudo apt install -y wget tar
    Prometheus
    Blackbox_Exporter
    Alertmanager
}

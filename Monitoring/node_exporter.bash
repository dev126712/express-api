#!/usr/bin/env bash
set -e
Node_Exporter() {
    # Download and install Node Exporter
    wget https://github.com/prometheus/node_exporter/releases/download/v1.10.2/node_exporter-1.10.2.linux-amd64.tar.gz
    tar -xvfz node_exporter-1.10.2.linux-amd64.tar.gz
    rm node_exporter-1.10.2.linux-amd64.tar.gz
    mv node_exporter-1.10.2.linux-amd64 /node_exporter
}
main() {
    sudo apt update
    sudo apt install -y wget tar
    Node_Exporter
}

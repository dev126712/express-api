gcp Load Balancer Firewall
````
gcloud compute firewall-rules create allow-frontend-http \
    --allow tcp:80 \
    --target-tags $(gcloud compute instances describe $(kubectl get nodes -o jsonpath='{.items[0].metadata.name}') --format='value(tags.items[0])') \
    --description="Allow port 80 for frontend service"
````

allows http traffic to lb

````
gcloud compute firewall-rules create allow-frontend-http-80 \
    --action=ALLOW \
    --rules=tcp:80 \
    --source-ranges=0.0.0.0/0 \
    --description="Allow port 80 for frontend"
````

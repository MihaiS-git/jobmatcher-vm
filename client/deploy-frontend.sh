#!/usr/bin/env bash
set -euo pipefail

VM_IP="${1:?Usage: deploy-frontend.sh <vm_ip>}"
VM_USER="${2:-mihaivm}"
TARGET="/var/www/jobmatcher-frontend"

npm run build

ssh "$VM_USER@$VM_IP" "sudo mkdir -p $TARGET && sudo chown -R $VM_USER:$VM_USER $TARGET"
rsync -avz --delete dist/ "$VM_USER@$VM_IP:$TARGET/"
ssh "$VM_USER@$VM_IP" "sudo chown -R www-data:www-data $TARGET && sudo chmod -R 755 $TARGET"

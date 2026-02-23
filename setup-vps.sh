#!/bin/bash

# Non-interactive mode for apt
export DEBIAN_FRONTEND=noninteractive

echo "--- 1. Temizlik ---"
apt-get remove -y docker docker-engine docker.io containerd runc || true
apt-get update

echo "--- 2. Bagimliliklar ---"
apt-get install -y ca-certificates curl gnupg software-properties-common

echo "--- 3. Docker GPG Anahtari ---"
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -y -o /etc/apt/keyrings/docker.gpg

echo "--- 4. Docker Repository ---"
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

echo "--- 5. Kurulum (Docker, Git, UFW) ---"
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin git ufw

echo "--- 6. Guvenlik Duvari ---"
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw --force enable

echo "--- 7. Klasorler ---"
mkdir -p /root/Repositories/ApplyFollow
mkdir -p ~/applyfollow

echo "Kurulum tamamlandi!"

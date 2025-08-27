#!/usr/bin/env python3
"""
Script to fix GitHub repository settings for HACS validation.
This will automatically set description and topics via GitHub API.
"""

import json
import os
import requests
from typing import Dict, Any

# Repository details
REPO_OWNER = "davidss20"
REPO_NAME = "home-assistant-24h-timer-card-n"

# Settings to apply
DESCRIPTION = "Professional-grade 24-hour scheduling integration for Home Assistant with server-side automation, condition-based control, and beautiful visual interface."

TOPICS = [
    "home-assistant",
    "hacs",
    "custom-integration", 
    "timer",
    "scheduler",
    "automation",
    "24-hour",
    "smart-home",
    "lovelace",
    "websocket"
]

def update_github_repo(token: str) -> bool:
    """Update GitHub repository description and topics."""
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # Update description
    description_data = {
        "description": DESCRIPTION
    }
    
    description_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"
    print(f"Updating description...")
    
    response = requests.patch(description_url, headers=headers, json=description_data)
    if response.status_code == 200:
        print("✅ Description updated successfully!")
    else:
        print(f"❌ Failed to update description: {response.status_code}")
        print(response.text)
        return False
    
    # Update topics
    topics_data = {
        "names": TOPICS
    }
    
    topics_url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/topics"
    print(f"Updating topics...")
    
    response = requests.put(topics_url, headers=headers, json=topics_data)
    if response.status_code == 200:
        print("✅ Topics updated successfully!")
        print(f"Added topics: {', '.join(TOPICS)}")
        return True
    else:
        print(f"❌ Failed to update topics: {response.status_code}")
        print(response.text)
        return False

def main():
    """Main function."""
    print("🚀 GitHub Repository Settings Fixer")
    print("=" * 50)
    
    # Get GitHub token
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        print("❌ GITHUB_TOKEN environment variable not set!")
        print("\nTo get a token:")
        print("1. Go to GitHub → Settings → Developer settings → Personal access tokens")
        print("2. Generate new token with 'repo' permissions")
        print("3. Set environment variable: set GITHUB_TOKEN=your_token_here")
        return
    
    # Update repository
    if update_github_repo(token):
        print("\n🎉 All settings updated successfully!")
        print("\nNow run HACS validation again - it should pass!")
    else:
        print("\n❌ Failed to update some settings.")

if __name__ == "__main__":
    main()

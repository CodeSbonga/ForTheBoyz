#!/usr/bin/env python3
import requests
import json
import time

def test_api():
    base_url = "http://localhost:5000/api"
    
    print("Testing Telkom Parental Dashboard API...")
    print("=" * 50)
    
    # Test login
    print("1. Testing login...")
    login_data = {"username": "parent", "password": "parent123"}
    try:
        response = requests.post(f"{base_url}/login", json=login_data)
        if response.status_code == 200:
            print("✅ Login successful!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    print()
    
    # Test study mode
    print("2. Testing study mode...")
    try:
        response = requests.get(f"{base_url}/study-mode")
        if response.status_code == 200:
            print("✅ Study mode retrieved!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Study mode failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Study mode error: {e}")
    
    print()
    
    # Test rules
    print("3. Testing rules...")
    try:
        response = requests.get(f"{base_url}/rules")
        if response.status_code == 200:
            print("✅ Rules retrieved!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Rules failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Rules error: {e}")
    
    print()
    
    # Test usage reports
    print("4. Testing usage reports...")
    try:
        response = requests.get(f"{base_url}/usage-reports")
        if response.status_code == 200:
            print("✅ Usage reports retrieved!")
            data = response.json()
            print(f"   Reports count: {len(data['reports'])}")
            print(f"   AI recommendation: {data['ai_recommendation']}")
        else:
            print(f"❌ Usage reports failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Usage reports error: {e}")
    
    print()
    
    # Test game scores
    print("5. Testing game scores...")
    try:
        response = requests.get(f"{base_url}/game-scores")
        if response.status_code == 200:
            print("✅ Game scores retrieved!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Game scores failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Game scores error: {e}")
    
    print()
    print("=" * 50)
    print("API testing completed!")

if __name__ == "__main__":
    time.sleep(2)  # Wait for server to start
    test_api()
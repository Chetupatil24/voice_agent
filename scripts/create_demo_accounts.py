#!/usr/bin/env python3
"""
Create demo tenant + user accounts for VaaniAI.

Usage:
  python scripts/create_demo_accounts.py --api https://voiceagent-production-94e5.up.railway.app

Required env vars (or pass --api flag):
  VAANI_API_URL  - Backend base URL
"""
import argparse
import json
import sys
import urllib.request
import urllib.error

DEMO_ACCOUNTS = [
    {
        "business_name": "Demo Dental Clinic",
        "email": "demo@dental.vaaniai.com",
        "password": "Demo@1234",
        "phone": "+919876543210",
        "industry": "healthcare",
    },
    {
        "business_name": "Demo Restaurant",
        "email": "demo@restaurant.vaaniai.com",
        "password": "Demo@1234",
        "phone": "+919876543211",
        "industry": "food_beverage",
    },
]


def post(url: str, payload: dict) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        print(f"  HTTP {e.code}: {body}")
        raise


def main() -> None:
    parser = argparse.ArgumentParser(description="Create VaaniAI demo accounts")
    parser.add_argument(
        "--api",
        default="https://voiceagent-production-94e5.up.railway.app",
        help="Backend base URL",
    )
    args = parser.parse_args()
    base = args.api.rstrip("/")

    print(f"Target API: {base}\n")

    for account in DEMO_ACCOUNTS:
        print(f"Creating: {account['business_name']} ({account['email']})")
        try:
            result = post(f"{base}/api/v1/auth/register", account)
            tenant_id = result.get("tenant_id") or result.get("id", "N/A")
            print(f"  ✓ Created  tenant_id={tenant_id}")
            print(f"  Email:     {account['email']}")
            print(f"  Password:  {account['password']}")
            print()
        except Exception as exc:
            print(f"  ✗ Failed: {exc}\n")
            sys.exit(1)

    print("Done. Save these credentials for demo purposes.")


if __name__ == "__main__":
    main()

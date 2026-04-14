#!/usr/bin/env python3
"""
Create two demo tenant accounts for VaaniAI testing.

Usage:
  python scripts/create_demo_accounts.py
  python scripts/create_demo_accounts.py --api https://voiceagent-production-94e5.up.railway.app

Accounts created:
  Tenant 001 — Demo Healthcare Clinic
  Tenant 002 — Demo Restaurant
"""
import argparse
import json
import sys
import urllib.request
import urllib.error

DEMO_ACCOUNTS = [
    {
        "business_name": "Demo Clinic 001",
        "email": "tenant001@vaaniai.com",
        "password": "Demo@001#VaaniAI",
        "phone": "+919800000001",
        "industry": "healthcare",
    },
    {
        "business_name": "Demo Restaurant 002",
        "email": "tenant002@vaaniai.com",
        "password": "Demo@002#VaaniAI",
        "phone": "+919800000002",
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
    print("=" * 55)
    print("VaaniAI Demo Tenant Accounts")
    print("=" * 55)

    created = []
    for account in DEMO_ACCOUNTS:
        print(f"\nCreating: {account['business_name']}")
        try:
            result = post(f"{base}/api/v1/auth/signup", account)
            tenant_id = result.get("tenant_id", "N/A")
            created.append({**account, "tenant_id": tenant_id})
            print(f"  ✓ Success  tenant_id={tenant_id}")
        except urllib.error.HTTPError as e:
            # 409 = already exists, treat as success
            if e.code == 409:
                print(f"  ✓ Already exists (skipped)")
            else:
                print(f"  ✗ Failed")
                sys.exit(1)
        except Exception as exc:
            print(f"  ✗ Failed: {exc}")
            sys.exit(1)

    print("\n" + "=" * 55)
    print("DEMO LOGIN CREDENTIALS")
    print("=" * 55)
    for a in DEMO_ACCOUNTS:
        print(f"\n  {a['business_name']}")
        print(f"  Login URL : {base.replace('https://','')}/login")
        print(f"  Email     : {a['email']}")
        print(f"  Password  : {a['password']}")
    print("\n  Owner Admin Portal")
    print(f"  Login URL : {base.replace('https://','')}/owner-login")
    print(f"  Email     : chetan24@vaaniai.com")
    print(f"  Password  : ChetuR@2423")
    print("\n" + "=" * 55)
    print("Save these credentials!")


if __name__ == "__main__":
    main()


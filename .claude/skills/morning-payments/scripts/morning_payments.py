#!/usr/bin/env python3
"""Morning (Green Invoice) Payment Links API client.

Usage:
  python3 morning_payments.py search [--status STATUS] [--query QUERY]
  python3 morning_payments.py get <link_id>
  python3 morning_payments.py create <price> <description> [--max-payments N] [--max-quantity N]
  python3 morning_payments.py update <link_id> [--price PRICE] [--description DESC] [--status STATUS]
  python3 morning_payments.py deactivate <link_id>
  python3 morning_payments.py plugins
  python3 morning_payments.py duplicate <link_id> [--price PRICE] [--description DESC]
"""

import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent
ENV_PATH = SCRIPTS_DIR / ".env"

BASE_URL = "https://api.greeninvoice.co.il/api/v1"


def load_env():
    """Load credentials from .env file."""
    if ENV_PATH.exists():
        for line in ENV_PATH.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                os.environ.setdefault(key.strip(), value.strip())


def get_credentials():
    load_env()
    api_key = os.environ.get("MORNING_PAYMENTS_API_KEY") or os.environ.get("MORNING_API_KEY")
    api_secret = os.environ.get("MORNING_PAYMENTS_API_SECRET") or os.environ.get("MORNING_API_SECRET")
    if not api_key or not api_secret:
        print(json.dumps({"error": "Missing MORNING_PAYMENTS_API_KEY / MORNING_PAYMENTS_API_SECRET in .env"}))
        sys.exit(1)
    return api_key, api_secret


def get_token():
    api_key, api_secret = get_credentials()
    data = json.dumps({"id": api_key, "secret": api_secret}).encode()
    req = urllib.request.Request(
        f"{BASE_URL}/account/token",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())["token"]


def api(method, path, body=None):
    token = get_token()
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        f"{BASE_URL}{path}",
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body_text = e.read().decode()
        try:
            return json.loads(body_text)
        except json.JSONDecodeError:
            return {"error": body_text, "status": e.code}


# ── Commands ─────────────────────────────────────────────

def cmd_search(args):
    """Search payment links. Flags: --status 10/20, --query text, --page N"""
    params = {"page": 1, "pageSize": 50}
    i = 0
    while i < len(args):
        if args[i] == "--status" and i + 1 < len(args):
            params["status"] = int(args[i + 1]); i += 2
        elif args[i] == "--query" and i + 1 < len(args):
            params["query"] = args[i + 1]; i += 2
        elif args[i] == "--page" and i + 1 < len(args):
            params["page"] = int(args[i + 1]); i += 2
        else:
            i += 1

    result = api("POST", "/payments/links/search", params)
    if "items" in result:
        print(json.dumps({
            "total": result.get("total", 0),
            "pages": result.get("pages", 0),
            "links": [
                {
                    "id": item["id"],
                    "description": item.get("description", item.get("data", {}).get("description", "")),
                    "price": item.get("price"),
                    "currency": item.get("currency", "ILS"),
                    "status": item.get("status"),
                    "status_label": "active" if item.get("status") == 10 else "inactive",
                    "url": item.get("shortUrl") or item.get("url", ""),
                    "created": item.get("creationDate"),
                }
                for item in result["items"]
            ],
        }, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


def cmd_get(args):
    """Get single link details."""
    if not args:
        print(json.dumps({"error": "Usage: get <link_id>"}))
        sys.exit(1)
    result = api("GET", f"/payments/links/{args[0]}")
    print(json.dumps(result, ensure_ascii=False, indent=2))


def cmd_plugins(args):
    """Extract plugin config from an existing active link."""
    result = api("POST", "/payments/links/search", {"page": 1, "pageSize": 1, "status": 10})
    items = result.get("items", [])
    if not items:
        print(json.dumps({"error": "No active links found. Create one manually in Morning first."}))
        sys.exit(1)

    link_id = items[0]["id"]
    detail = api("GET", f"/payments/links/{link_id}")
    plugins = detail.get("data", {}).get("plugins", [])

    print(json.dumps({
        "source_link": link_id,
        "source_description": detail.get("description", ""),
        "plugins": plugins,
        "note": "These plugins represent your payment terminal (Meshulam). They are required when creating new links via API.",
    }, ensure_ascii=False, indent=2))


def cmd_create(args):
    """Create a new payment link. Usage: create <price> <description> [flags]"""
    if len(args) < 2:
        print(json.dumps({"error": "Usage: create <price> <description> [--max-payments N] [--max-quantity N]"}))
        sys.exit(1)

    price = float(args[0])
    description = args[1]
    max_payments = 1
    max_quantity = 1

    i = 2
    while i < len(args):
        if args[i] == "--max-payments" and i + 1 < len(args):
            max_payments = int(args[i + 1]); i += 2
        elif args[i] == "--max-quantity" and i + 1 < len(args):
            max_quantity = int(args[i + 1]); i += 2
        else:
            i += 1

    plugins = _get_plugins()

    body = {
        "type": 0,
        "price": price,
        "currency": "ILS",
        "lang": "he",
        "description": description,
        "documentType": 320,
        "documentVatType": 0,
        "maxPayments": max_payments,
        "maxQuantity": max_quantity,
        "notify": True,
        "addClient": False,
        "openAmount": False,
        "showSearchEngines": True,
        "themeId": 1000,
        "requireTaxId": False,
        "plugins": plugins,
    }

    result = api("POST", "/payments/links", body)
    if "id" in result:
        print(json.dumps({
            "success": True,
            "id": result["id"],
            "description": result.get("description", ""),
            "price": result.get("price"),
            "url": result.get("url", ""),
            "shortUrl": result.get("shortUrl", ""),
        }, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


def cmd_update(args):
    """Update a payment link. Usage: update <link_id> [--price N] [--description TEXT] [--status N]"""
    if not args:
        print(json.dumps({"error": "Usage: update <link_id> [--price N] [--description TEXT] [--status N]"}))
        sys.exit(1)

    link_id = args[0]
    body = {}
    i = 1
    while i < len(args):
        if args[i] == "--price" and i + 1 < len(args):
            body["price"] = float(args[i + 1]); i += 2
        elif args[i] == "--description" and i + 1 < len(args):
            body["description"] = args[i + 1]; i += 2
        elif args[i] == "--status" and i + 1 < len(args):
            body["status"] = int(args[i + 1]); i += 2
        elif args[i] == "--max-payments" and i + 1 < len(args):
            body["maxPayments"] = int(args[i + 1]); i += 2
        else:
            i += 1

    if not body:
        print(json.dumps({"error": "Nothing to update. Use --price, --description, --status, --max-payments"}))
        sys.exit(1)

    result = api("PUT", f"/payments/links/{link_id}", body)
    if "id" in result:
        print(json.dumps({
            "success": True,
            "id": result["id"],
            "description": result.get("description", ""),
            "price": result.get("price"),
            "status": result.get("status"),
        }, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


def cmd_deactivate(args):
    """Deactivate a link (set status=20)."""
    if not args:
        print(json.dumps({"error": "Usage: deactivate <link_id>"}))
        sys.exit(1)
    result = api("PUT", f"/payments/links/{args[0]}", {"status": 20})
    if "id" in result:
        print(json.dumps({"success": True, "id": result["id"], "status": result.get("status")}))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


def cmd_duplicate(args):
    """Duplicate an existing link with optional overrides."""
    if not args:
        print(json.dumps({"error": "Usage: duplicate <link_id> [--price N] [--description TEXT]"}))
        sys.exit(1)

    source = api("GET", f"/payments/links/{args[0]}")
    if "errorCode" in source:
        print(json.dumps(source, ensure_ascii=False, indent=2))
        sys.exit(1)

    data = source.get("data", {})
    price = source.get("price")
    description = source.get("description", "")

    i = 1
    while i < len(args):
        if args[i] == "--price" and i + 1 < len(args):
            price = float(args[i + 1]); i += 2
        elif args[i] == "--description" and i + 1 < len(args):
            description = args[i + 1]; i += 2
        else:
            i += 1

    body = {
        "type": source.get("type", 0),
        "price": price,
        "currency": source.get("currency", "ILS"),
        "lang": source.get("lang", "he"),
        "description": description,
        "documentType": data.get("documentType", 320),
        "documentVatType": data.get("documentVatType", 0),
        "maxPayments": data.get("maxPayments", 1),
        "maxQuantity": data.get("maxQuantity", 1),
        "notify": data.get("notify", True),
        "addClient": data.get("addClient", False),
        "openAmount": data.get("openAmount", False),
        "showSearchEngines": data.get("showSearchEngines", True),
        "themeId": data.get("themeId", 1000),
        "requireTaxId": data.get("requireTaxId", False),
        "plugins": data.get("plugins", []),
    }

    result = api("POST", "/payments/links", body)
    if "id" in result:
        print(json.dumps({
            "success": True,
            "duplicated_from": args[0],
            "id": result["id"],
            "description": result.get("description", ""),
            "price": result.get("price"),
            "url": result.get("url", ""),
            "shortUrl": result.get("shortUrl", ""),
        }, ensure_ascii=False, indent=2))
    else:
        print(json.dumps(result, ensure_ascii=False, indent=2))


# ── Helpers ──────────────────────────────────────────────

def _get_plugins():
    """Get plugin config from an existing active link (auto-discovery)."""
    result = api("POST", "/payments/links/search", {"page": 1, "pageSize": 1, "status": 10})
    items = result.get("items", [])
    if not items:
        print(json.dumps({"error": "No active links found. Cannot discover plugins. Create a link manually in Morning first."}))
        sys.exit(1)

    detail = api("GET", f"/payments/links/{items[0]['id']}")
    plugins = detail.get("data", {}).get("plugins", [])
    if not plugins:
        print(json.dumps({"error": "Active link found but has no plugins. Check your payment terminal setup in Morning."}))
        sys.exit(1)

    return plugins


# ── CLI Router ───────────────────────────────────────────

COMMANDS = {
    "search": cmd_search,
    "get": cmd_get,
    "create": cmd_create,
    "update": cmd_update,
    "deactivate": cmd_deactivate,
    "duplicate": cmd_duplicate,
    "plugins": cmd_plugins,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print(__doc__)
        sys.exit(0)

    cmd = sys.argv[1]
    if cmd not in COMMANDS:
        print(json.dumps({"error": f"Unknown command: {cmd}. Available: {', '.join(COMMANDS)}"}))
        sys.exit(1)

    COMMANDS[cmd](sys.argv[2:])


if __name__ == "__main__":
    main()

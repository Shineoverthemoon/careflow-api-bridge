"""
CareFlow API Bridge — Selenium smoke test.

Run before sending the demo to anyone. Run again against the deployed URL
before adding to the portfolio.

Usage (local):
    $env:CAREFLOW_URL = "http://localhost:5173"
    python tests/smoke_careflow.py

Usage (deployed):
    $env:CAREFLOW_URL = "https://your-deployed-url"
    python tests/smoke_careflow.py

Usage (headless):
    $env:HEADLESS = "1"
    python tests/smoke_careflow.py

Exit codes:
    0 = pass
    1 = fail (screenshot saved to tests/screenshots/)
"""

import os
import sys
from pathlib import Path
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager


APP_URL = os.getenv("CAREFLOW_URL", "http://localhost:5173")
HEADLESS = os.getenv("HEADLESS", "0") == "1"

SCREENSHOT_DIR = Path(__file__).parent / "screenshots"
SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)


def log(msg: str) -> None:
    print(f"[SMOKE] {msg}")


def save_failure_screenshot(driver, label: str) -> Path:
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_label = "".join(c if c.isalnum() else "_" for c in label)[:60]
    path = SCREENSHOT_DIR / f"failure_{ts}_{safe_label}.png"
    try:
        driver.save_screenshot(str(path))
    except Exception:
        pass
    return path


def wait_testid(driver, testid: str, timeout: int = 15):
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, f"[data-testid='{testid}']"))
    )


def click_testid(driver, testid: str, timeout: int = 15):
    el = WebDriverWait(driver, timeout).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, f"[data-testid='{testid}']"))
    )
    el.click()
    return el


def _ci_contains(haystack: str, needle: str) -> bool:
    """Case-insensitive substring match.

    The CareFlow UI uses CSS `text-transform: uppercase` on tags, headers, and
    labels. Selenium's `element.text` returns the *rendered* text, so it sees
    'BACKEND HEALTHY' even though the JSX literal is 'Backend Healthy'.
    We compare case-insensitively to make tests robust against text-transform.
    """
    if haystack is None or needle is None:
        return False
    return needle.lower() in haystack.lower()


def wait_text(driver, text: str, timeout: int = 15):
    """Wait for any element to contain the given text (case-insensitive)."""
    # XPath translate() to lowercase for case-insensitive match
    needle = text.lower()
    xpath = (
        "//*[contains("
        "translate(normalize-space(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "
        f"{repr(needle)})]"
    )
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )


def wait_text_in_testid(driver, testid: str, text: str, timeout: int = 15):
    """Wait until the element with given testid contains the given text (case-insensitive)."""
    def condition(d):
        try:
            el = d.find_element(By.CSS_SELECTOR, f"[data-testid='{testid}']")
            return _ci_contains(el.text, text)
        except Exception:
            return False
    WebDriverWait(driver, timeout).until(condition)


def assert_all_texts_in_testid(driver, testid: str, texts, timeout: int = 15):
    """Wait for the testid to be present, then check it contains every required text (case-insensitive)."""
    wait_testid(driver, testid, timeout)
    # Give content a moment to populate after a click
    def all_present(d):
        try:
            el = d.find_element(By.CSS_SELECTOR, f"[data-testid='{testid}']")
            full = el.text
            return all(_ci_contains(full, t) for t in texts)
        except Exception:
            return False
    WebDriverWait(driver, timeout).until(all_present)


def check_no_localhost_calls(driver):
    """If we're testing a deployed URL, the page must not be calling localhost."""
    is_local = "localhost" in APP_URL or "127.0.0.1" in APP_URL
    if is_local:
        log("Local URL detected. Skipping localhost network check.")
        return

    urls = driver.execute_script(
        "return performance.getEntriesByType('resource').map(r => r.name);"
    )
    bad = [u for u in urls if "localhost" in u or "127.0.0.1" in u]
    if bad:
        raise AssertionError(
            "Deployed app is calling localhost. The frontend points at a "
            "local backend that nobody else can reach. Bad URLs:\n  "
            + "\n  ".join(bad[:10])
        )


def check_console_errors(driver):
    """Check browser console for severe JS errors."""
    try:
        logs = driver.get_log("browser")
    except Exception:
        log("Browser console logs unavailable. Skipping console check.")
        return

    severe = [e for e in logs if e.get("level") == "SEVERE"]
    if severe:
        msgs = "\n  ".join(e.get("message", "")[:200] for e in severe[:5])
        raise AssertionError(f"Severe browser console errors found:\n  {msgs}")


def build_driver() -> webdriver.Chrome:
    opts = Options()
    opts.add_argument("--window-size=1440,1200")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--no-sandbox")
    if HEADLESS:
        opts.add_argument("--headless=new")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=opts)


def run_smoke_test() -> int:
    log(f"Target URL: {APP_URL}")
    log(f"Headless: {HEADLESS}")

    driver = build_driver()
    current_step = "init"

    try:
        # 1 — page loads
        current_step = "open page"
        driver.get(APP_URL)
        wait_testid(driver, "app-title")
        title_text = driver.find_element(By.CSS_SELECTOR, "[data-testid='app-title']").text
        assert _ci_contains(title_text, "CareFlow API Bridge"), \
            f"unexpected title: {title_text!r}"
        log("✓ Page loaded")

        # 2 — backend healthy
        current_step = "backend health"
        wait_text_in_testid(driver, "backend-status", "Backend Healthy", timeout=20)
        log("✓ Backend Healthy")

        # 3 — required content sections render
        current_step = "static panels"
        wait_testid(driver, "business-value")
        wait_text(driver, "Eliminate manual re-entry")
        wait_testid(driver, "mulesoft-mapping")
        wait_text(driver, "Experience API")
        wait_text(driver, "Process API")
        wait_text(driver, "System APIs")
        wait_testid(driver, "api-contract")
        wait_text(driver, "/api/intake")
        wait_testid(driver, "architecture-section")
        log("✓ Business Value, MuleSoft Mapping, API Contract, Architecture all render")

        # 4 — submit intake
        current_step = "submit intake"
        click_testid(driver, "submit-intake")
        log("✓ Submit Intake clicked")

        # 5 — payload transformation populates
        current_step = "payload transformation"
        wait_testid(driver, "payload-before", timeout=20)
        wait_testid(driver, "payload-after", timeout=20)
        assert_all_texts_in_testid(
            driver, "payload-after",
            ["intakeId", "patient", "appointment", "routing", "downstream"],
            timeout=20,
        )
        log("✓ Payload transformation populated with normalized structure")

        # 6 — routing decisions
        current_step = "routing decisions"
        assert_all_texts_in_testid(
            driver, "routing-decisions",
            ["urgent", "new-patient-intake"],
        )
        log("✓ Routing decisions: urgent, new-patient-intake")

        # 7 — downstream systems
        current_step = "downstream systems"
        assert_all_texts_in_testid(
            driver, "downstream-systems",
            ["Mock EHR", "Mock Scheduling", "Mock Notification"],
        )
        log("✓ Downstream Mock EHR / Scheduling / Notification all populated")

        # 8 — flow events tab
        current_step = "flow events tab"
        click_testid(driver, "flow-events-tab")
        # Wait a moment for the tab content to update
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='flow-events-list']"))
        )
        assert_all_texts_in_testid(
            driver, "flow-events-list",
            [
                "intake-received",
                "validation-passed",
                "transformation-complete",
                "routing-decision",
                "system-api-call",
            ],
        )
        log("✓ Flow Events: all 5 required event kinds present")

        # 9 — raw http tab
        current_step = "raw http tab"
        click_testid(driver, "raw-http-tab")
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='raw-http-list']"))
        )
        assert_all_texts_in_testid(
            driver, "raw-http-list",
            ["GET", "/api/"],
        )
        log("✓ Raw HTTP: GET and /api/ entries present")

        # 10 — deployed app does not call localhost
        current_step = "localhost network check"
        check_no_localhost_calls(driver)
        log("✓ No localhost calls (or local test, skipped)")

        # 11 — no severe console errors
        current_step = "console errors"
        check_console_errors(driver)
        log("✓ No severe browser console errors")

        print("\n" + "=" * 60)
        print(" PASS  CareFlow smoke test passed all checks.")
        print("=" * 60)
        return 0

    except Exception as exc:
        path = save_failure_screenshot(driver, current_step)
        print("\n" + "=" * 60)
        print(f" FAIL  Step: {current_step}")
        print(f" FAIL  Reason: {exc}")
        print(f" FAIL  Screenshot: {path}")
        print("=" * 60)
        return 1

    finally:
        driver.quit()


if __name__ == "__main__":
    sys.exit(run_smoke_test())

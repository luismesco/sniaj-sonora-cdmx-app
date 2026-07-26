import os
import re
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get(
    "SNIAJ_BASE_URL",
    "http://localhost:5173/sniaj-sonora-cdmx-app/",
)


def launch_browser(playwright):
    browsers_root = Path(os.environ.get("PLAYWRIGHT_BROWSERS_PATH", ""))
    bundled_chrome = (
        browsers_root
        / "chromium-1208/chrome-mac-x64/Google Chrome for Testing.app"
        / "Contents/MacOS/Google Chrome for Testing"
    )
    local_chrome = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    options = {"headless": True, "args": ["--headless=new", "--disable-gpu"]}
    if bundled_chrome.exists():
        options["executable_path"] = str(bundled_chrome)
    elif local_chrome.exists():
        options["executable_path"] = str(local_chrome)
    return playwright.chromium.launch(**options)


with sync_playwright() as playwright:
    browser = launch_browser(playwright)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto(BASE_URL, wait_until="networkidle")

    expect(page.locator(".metric").first.locator("strong")).to_have_text("360")

    sonora_trigger = page.get_by_role("button", name="Ver resumen de Sonora")
    sonora_trigger.click()
    dialog = page.get_by_role("dialog", name="Resumen de Sonora")
    expect(dialog).to_be_visible()
    expect(dialog.get_by_test_id("summary-total")).to_have_text("82")
    expect(dialog.get_by_test_id("summary-law")).to_have_text("29")
    expect(dialog.get_by_test_id("summary-public")).to_have_text("32")
    expect(dialog.get_by_test_id("summary-private")).to_have_text("50")

    dialog.get_by_role("button", name="Públicas", exact=True).click()
    dialog.get_by_role("checkbox", name="Solo con Derecho").check()
    expect(dialog.get_by_role("button", name="Ver 3 instituciones")).to_be_enabled()
    dialog.get_by_role("button", name="Cancelar").click()

    expect(dialog).not_to_be_visible()
    expect(page.locator(".metric").first.locator("strong")).to_have_text("360")
    assert "estado=" not in page.url

    sonora_trigger.click()
    dialog.get_by_role("button", name="Públicas", exact=True).click()
    dialog.get_by_role("checkbox", name="Solo con Derecho").check()
    dialog.get_by_role("button", name="Ver 3 instituciones").click()

    expect(page.locator(".metric").first.locator("strong")).to_have_text("3")
    expect(page.locator(".filter-context")).to_contain_text("Sonora")
    expect(page.locator(".filter-context")).to_contain_text("Solo con Derecho")
    assert "estado=Sonora" in page.url
    assert "regimen=Publica" in page.url
    assert "derecho=1" in page.url
    expect(page.locator("#institution-list-title")).to_be_focused()

    page.get_by_role("button", name="Limpiar filtros").click()
    table_row = page.locator(".inventory-table tbody tr").nth(1)
    table_button = table_row.locator("button.table-institution")
    expect(table_button).to_have_count(1)
    table_button.focus()
    page.keyboard.press("Enter")
    expect(table_row).to_have_class(re.compile(r"\bactive-row\b"))

    page.get_by_role("button", name="Ver resumen de CDMX").click()
    dialog = page.get_by_role("dialog", name="Resumen de CDMX")
    expect(dialog.get_by_test_id("summary-total")).to_have_text("278")
    expect(dialog.get_by_test_id("summary-law")).to_have_text("128")
    expect(dialog.get_by_test_id("summary-public")).to_have_text("52")
    expect(dialog.get_by_test_id("summary-private")).to_have_text("226")
    dialog.get_by_role("button", name="Privadas", exact=True).click()
    dialog.get_by_role("checkbox", name="Solo con Derecho").check()
    expect(dialog.get_by_role("button", name="Ver 120 instituciones")).to_be_enabled()

    page.keyboard.press("Escape")
    expect(dialog).not_to_be_visible()
    browser.close()

print("map-summary: Sonora and CDMX summary flows passed")

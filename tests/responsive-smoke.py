import os
from pathlib import Path
from playwright.sync_api import sync_playwright

viewports = [
    ("phone", 390, 844),
    ("tablet", 834, 1112),
    ("desktop", 1440, 980),
]

with sync_playwright() as p:
    browsers_root = Path(os.environ.get("PLAYWRIGHT_BROWSERS_PATH", ""))
    chrome = browsers_root / "chromium-1208/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
    launch_options = {"headless": True}
    if chrome.exists():
        launch_options["executable_path"] = str(chrome)
    browser = p.chromium.launch(**launch_options)
    results = []
    for name, width, height in viewports:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.goto("http://localhost:3000/", wait_until="networkidle")
        page.get_by_role("button", name="Sonora").click()
        page.get_by_role("button", name="Exportar resultados filtrados en CSV").click()
        page.get_by_text("Universidad de Sonora").click()
        page.fill("#note", f"Prueba responsive {name}")
        metrics = page.evaluate(
            """() => ({
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
                heading: document.querySelector('h1')?.innerText,
                buttons: document.querySelectorAll('button').length
            })"""
        )
        screenshot = Path("/private/tmp") / f"sniaj-{name}.png"
        page.screenshot(path=str(screenshot), full_page=True)
        results.append((name, metrics, errors, screenshot))
        page.close()
    browser.close()

for name, metrics, errors, screenshot in results:
    overflow = metrics["scrollWidth"] > metrics["clientWidth"] + 1
    print(f"{name}: width={metrics['clientWidth']} scroll={metrics['scrollWidth']} overflow={overflow} buttons={metrics['buttons']} screenshot={screenshot}")
    print(f"heading={metrics['heading']}")
    if errors:
        print(f"console_errors={errors}")

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
    local_chrome = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    launch_options = {"headless": True, "args": ["--headless=new", "--disable-gpu"]}
    if chrome.exists():
        launch_options["executable_path"] = str(chrome)
    elif local_chrome.exists():
        launch_options["executable_path"] = str(local_chrome)
    browser = p.chromium.launch(**launch_options)
    results = []
    for name, width, height in viewports:
        page = browser.new_page(viewport={"width": width, "height": height})
        errors = []
        failed_resources = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("response", lambda response: failed_resources.append(response.url) if response.status >= 400 else None)
        page.goto("http://localhost:5173/sniaj-sonora-cdmx-app/", wait_until="networkidle")
        page.get_by_role("button", name="Sonora", exact=True).first.click()
        page.locator(".ranking-panel").scroll_into_view_if_needed()
        screenshot = Path("/private/tmp") / f"sniaj-{name}.png"
        page.screenshot(path=str(screenshot))
        page.get_by_role("button", name="Exportar resultados filtrados en CSV").click()
        page.locator(".ranking-panel .row").filter(has_text="INSTITUTO TECNOLÓGICO DE SONORA").click()
        page.fill("#note", f"Prueba responsive {name}")
        metrics = page.evaluate(
            """() => ({
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
                heading: document.querySelector('h1')?.innerText,
                buttons: document.querySelectorAll('button').length,
                institutionCount: document.querySelector('.metric strong')?.textContent,
                itsonRows: [...document.querySelectorAll('.ranking-panel .row strong')]
                    .filter((element) => element.textContent === 'INSTITUTO TECNOLÓGICO DE SONORA').length
            })"""
        )
        results.append((name, metrics, errors, failed_resources, screenshot))
        page.close()
    browser.close()

for name, metrics, errors, failed_resources, screenshot in results:
    overflow = metrics["scrollWidth"] > metrics["clientWidth"] + 1
    assert not overflow
    assert metrics["institutionCount"] == "82"
    assert metrics["itsonRows"] == 1
    print(f"{name}: width={metrics['clientWidth']} scroll={metrics['scrollWidth']} overflow={overflow} institutions={metrics['institutionCount']} itson_rows={metrics['itsonRows']} screenshot={screenshot}")
    print(f"heading={metrics['heading']}")
    if errors:
        print(f"console_errors={errors}")
    if failed_resources:
        print(f"failed_resources={failed_resources}")

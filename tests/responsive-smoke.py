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
        page.on(
            "console",
            lambda msg: errors.append(f"{msg.text} @ {msg.location}")
            if msg.type == "error"
            else None,
        )
        page.on("response", lambda response: failed_resources.append(response.url) if response.status >= 400 else None)
        page.goto("http://localhost:5173/sniaj-sonora-cdmx-app/", wait_until="networkidle")
        map_targets = {}
        for state in ("Sonora", "CDMX"):
            trigger = page.get_by_role("button", name=f"Ver resumen de {state}")
            map_targets[state] = trigger.bounding_box()

        page.get_by_role("button", name="Ver resumen de Sonora").click()
        dialog = page.get_by_role("dialog", name="Resumen de Sonora")
        dialog_box = dialog.bounding_box()
        expect_primary = dialog.get_by_role("button", name="Ver 82 instituciones")
        expect_cancel = dialog.get_by_role("button", name="Cancelar")
        expect_reset = dialog.get_by_role("button", name="Restablecer filtros")
        assert expect_primary.is_visible()
        assert expect_cancel.is_visible()
        assert expect_reset.is_visible()
        action_boxes = {
            "primary": expect_primary.bounding_box(),
            "cancel": expect_cancel.bounding_box(),
            "reset": expect_reset.bounding_box(),
        }
        dialog_screenshot = Path("/private/tmp") / f"sniaj-{name}-dialog.png"
        page.screenshot(path=str(dialog_screenshot))
        expect_cancel.click()

        page.get_by_role("button", name="Sonora", exact=True).first.click()
        page.locator(".ranking-panel").scroll_into_view_if_needed()
        screenshot = Path("/private/tmp") / f"sniaj-{name}.png"
        page.screenshot(path=str(screenshot))
        with page.expect_download() as download_info:
            page.get_by_role("button", name="Exportar resultados filtrados en CSV").click()
        assert download_info.value.suggested_filename == "sniaj-sonora.csv"
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
        results.append((name, width, height, metrics, map_targets, dialog_box, action_boxes, errors, failed_resources, screenshot, dialog_screenshot))
        page.close()
    browser.close()

for name, width, height, metrics, map_targets, dialog_box, action_boxes, errors, failed_resources, screenshot, dialog_screenshot in results:
    overflow = metrics["scrollWidth"] > metrics["clientWidth"] + 1
    assert not overflow
    assert metrics["institutionCount"] == "82"
    assert metrics["itsonRows"] == 1
    assert not errors, f"{name}: console errors {errors}"
    assert not failed_resources, f"{name}: failed resources {failed_resources}"
    assert dialog_box["x"] >= 0
    assert dialog_box["y"] >= 0
    assert dialog_box["x"] + dialog_box["width"] <= width
    assert dialog_box["y"] + dialog_box["height"] <= height
    for action, box in action_boxes.items():
        assert box["y"] >= 0, f"{name}: {action} starts outside viewport"
        assert box["y"] + box["height"] <= height, f"{name}: {action} ends outside viewport"
    for state, target in map_targets.items():
        assert target["width"] >= 44, f"{name}: {state} target width {target['width']}"
        assert target["height"] >= 44, f"{name}: {state} target height {target['height']}"
    print(f"{name}: width={metrics['clientWidth']} scroll={metrics['scrollWidth']} overflow={overflow} institutions={metrics['institutionCount']} itson_rows={metrics['itsonRows']} screenshot={screenshot} dialog={dialog_screenshot}")
    print(f"heading={metrics['heading']}")
    if errors:
        print(f"console_errors={errors}")
    if failed_resources:
        print(f"failed_resources={failed_resources}")

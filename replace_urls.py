import os

old_url = "https://vitreous-yovonnda-guuuvvb-0e1d8405.koyeb.app"
new_url = "https://kfc-api-backend-guuuvvb-7ca9627e.koyeb.app"

for root, dirs, files in os.walk("."):
    for file in files:
        if file.endswith(".html"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
            if old_url in content:
                new_content = content.replace(old_url, new_url)
                with open(path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                print(f"Updated: {path}")

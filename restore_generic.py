import json

log_path = "/home/shin/.gemini/antigravity/brain/d0d7cde1-3645-431f-8e78-438c6a7a0232/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r') as f:
    lines = f.readlines()

latest_content = None

for line in lines:
    try:
        entry = json.loads(line)
        if entry.get("type") == "PLANNER_RESPONSE" and "tool_calls" in entry:
            for tc in entry["tool_calls"]:
                if tc.get("name") in ["write_to_file", "replace_file_content"]:
                    args = tc.get("args", {})
                    target = args.get("TargetFile", "")
                    content = args.get("CodeContent", "")
                    if "GenericDetailPage.tsx" in target and tc.get("name") == "write_to_file":
                        latest_content = content
    except Exception as e:
        pass

if latest_content:
    with open("/home/shin/Documents/Frontend-Briksy/src/app/modules/apps/shared_table/entity-list/components/GenericDetailPage.tsx", "w") as f:
        f.write(latest_content)
    print("Restored GenericDetailPage.tsx")
else:
    print("Not found")

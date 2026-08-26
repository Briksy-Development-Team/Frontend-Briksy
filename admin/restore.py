import json

log_path = "/home/shin/.gemini/antigravity/brain/d0d7cde1-3645-431f-8e78-438c6a7a0232/.system_generated/logs/transcript_full.jsonl"
with open(log_path, 'r') as f:
    lines = f.readlines()

for line in lines:
    try:
        entry = json.loads(line)
        if entry.get("type") == "PLANNER_RESPONSE" and "tool_calls" in entry:
            for tc in entry["tool_calls"]:
                if tc.get("name") == "write_to_file":
                    args = tc.get("args", {})
                    target = args.get("TargetFile", "")
                    content = args.get("CodeContent", "")
                    if "shared_detail" in target and content:
                        print(f"Restoring {target}")
                        import os
                        os.makedirs(os.path.dirname(target), exist_ok=True)
                        with open(target, 'w') as out:
                            out.write(content)
    except Exception as e:
        pass

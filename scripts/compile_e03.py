"""Compile the existing E03 candidate dialogue without rewriting its line IDs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
rows = re.findall(r'^- \[(S01E03-([A-Z]+)-\d{3})\] “(.+)”$',
                  (ROOT / 'content/season-01/s01e03/DETAILED_SCRIPT.md').read_text(encoding='utf-8'), re.M)
assert rows and len(rows) == len({r[0] for r in rows})
data = {'episode': 's01e03', 'version': 's01e03-slice-v1',
        'build': '20261018-e03-perspective1', 'count': len(rows),
        'dialogueStatus': 'candidate_pending_owner_dialogue_lock',
        'lines': {key: {'id': key, 'speaker': speaker, 'text': text} for key, speaker, text in rows}}
(ROOT / 'public/s01e03.json').write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'PASS compiled {len(rows)} unchanged E03 candidate lines')

"""Compile exact locked voice text into a static E01 content channel."""
import csv
import hashlib
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = root / 'prompts/season-01/e01/40-voice-lines.tsv'
rows = list(csv.DictReader((x for x in source.read_text().splitlines() if not x.startswith('#')), delimiter='\t'))
script = (root / 'content/season-01/s01e01/DETAILED_SCRIPT.md').read_text()
script_lines = dict(re.findall(r'\[(S01E01-[A-Z]+-\d{3})\] “([^”]+)”', script))
assert len(rows) == len(script_lines) == 121
assert len({x['line_id'] for x in rows}) == 121
for row in rows:
    assert row['exact_text'] == script_lines[row['line_id']], row['line_id']
content = {
    'schemaVersion': 1, 'contentVersion': 's01e01-script-v1',
    'buildId': '20261009-e01-post-face1',
    'voiceSourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'lines': {x['line_id']: x for x in rows},
    'parent': {
        'preview': 'Today Milo, Nia, and Finn find something unusual in Town Square. Let your child look before you explain. If they call it a treasure map, ask what they see; do not confirm or deny the guess. No map knowledge is needed.',
        'cue': 'What can you see before we decide what it means?',
        'followup': 'Which part made you notice that?',
        'fallback': 'Can you point to a line or shape?',
        'reflection': 'What do we know for sure? What are we still guessing?'
    },
    'chronicle': {
        'title': 'Our First Old Map',
        'found': ['An old map behind the board.', 'A round fountain and big tree.', 'A clean old mark: RIVERSIDE →.'],
        'wonder': ['What does the empty shape mean?', 'Where did the old line go?']
    },
    'ids': {'scenes': [f's01e01-sc0{i}' for i in range(7)], 'interactions': ['s01e01-int01-observe-before-guess', 's01e01-int02-map-to-place-and-marker'], 'parentCue': 's01e01-cue-01', 'events': ['s01e01_old_map_fragment_documented','s01e01_blank_place_symbol_seen','s01_missing_place_mystery_open','s01e01_old_route_matches_town_square','s01e01_town_square_old_marker_revealed','s01e01_old_route_points_toward_riverside','episode_completed:s01e01']},
    'mediaStatus': {'voices': 'browser_synthetic_prototype_only', 'music': 'not_produced', 'sprites': 'production_candidate'}
}
out = root / 'public/episode.json'
out.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n')
print('Compiled 121 exact script/TSV lines; separate parent and child channels.')

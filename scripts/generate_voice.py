"""
Generate the prototype's voice files with AI4Bharat Indic Parler-TTS, an open model that speaks
Sanskrit natively. Sanskrit is voiced by "Aryan", Hindi meanings by "Divya" (the model card's
recommended speakers for those languages).

One-time setup, from mantramitra/:
    python -m venv .venv
    .venv/Scripts/python -m pip install torch --index-url https://download.pytorch.org/whl/cu126
    .venv/Scripts/python -m pip install git+https://github.com/huggingface/parler-tts.git soundfile "huggingface_hub[cli]"
    Accept the model terms at https://huggingface.co/ai4bharat/indic-parler-tts, then:
    .venv/Scripts/hf auth login        (paste a read token from https://huggingface.co/settings/tokens)

Run (node + ffmpeg on PATH):
    .venv/Scripts/python scripts/generate_voice.py                        # only files that don't exist
    .venv/Scripts/python scripts/generate_voice.py --force                # everything
    .venv/Scripts/python scripts/generate_voice.py --force gayatri-07 shiv-v2   # just these word / verse ids
    .venv/Scripts/python scripts/generate_voice.py --force shiv-1-03 --take 1  # a different take of one word

Full-verse recitations are built line by line (the model phrases short lines best), and each
word's `fullMantraAt` is written back into src/data so words highlight in sync.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import torch
from parler_tts import ParlerTTSForConditionalGeneration
from transformers import AutoTokenizer

ROOT = Path(__file__).resolve().parent.parent
MODEL_ID = 'ai4bharat/indic-parler-tts'

CHANT = (
    'Aryan speaks slowly with a slightly low-pitched, calm and clear voice. '
    'The recording is very clear audio with no background noise, and the voice sounds very close up.'
)
NARRATE = (
    'Divya speaks at a moderate pace with a warm, gentle and slightly expressive voice. '
    'The recording is very clear audio with no background noise, and the voice sounds very close up.'
)

# Spelling hints for a word the model mispronounces, keyed by word id: {'gayatri-06': '...'}
PRONOUNCE = {}

LINE_GAP_S = 0.7  # silence between lines of a full verse
PHRASE_GAP_S = 0.35  # silence between phrases of a meaning
TRIES = 4  # takes per clip when the length looks wrong (the model occasionally rambles)


class Voice:
    def __init__(self, take=0):
        self.take = take
        self.device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
        dtype = torch.bfloat16 if self.device != 'cpu' else torch.float32
        print(f'loading {MODEL_ID} on {self.device}…')
        self.model = ParlerTTSForConditionalGeneration.from_pretrained(MODEL_ID, torch_dtype=dtype).to(self.device)
        self.prompt_tok = AutoTokenizer.from_pretrained(MODEL_ID)
        self.desc_tok = AutoTokenizer.from_pretrained(self.model.config.text_encoder._name_or_path)
        self.sr = self.model.config.sampling_rate

    def say(self, text, description, max_s, max_gap_s=None):
        """One utterance, trimmed and levelled. Retries with a new seed if the length is implausible
        or, for single words, if a long silence splits it (a stray extra syllable)."""
        takes = []
        for seed in range(self.take * TRIES, (self.take + 1) * TRIES):
            torch.manual_seed(seed)
            d = self.desc_tok(description, return_tensors='pt').to(self.device)
            p = self.prompt_tok(text, return_tensors='pt').to(self.device)
            with torch.inference_mode():
                out = self.model.generate(
                    input_ids=d.input_ids,
                    attention_mask=d.attention_mask,
                    prompt_input_ids=p.input_ids,
                    prompt_attention_mask=p.attention_mask,
                )
            audio = trim(out.to(torch.float32).cpu().numpy().squeeze(), self.sr)
            dur = len(audio) / self.sr
            if 0.2 < dur <= max_s and (max_gap_s is None or longest_gap(audio, self.sr) < max_gap_s):
                return level(audio, self.sr)
            takes.append(audio)
        print(f'    ! "{text[:40]}" had no clean take; kept the shortest (try --take 1)')
        return level(min(takes, key=len), self.sr)

    def silence(self, seconds):
        return np.zeros(int(seconds * self.sr), dtype=np.float32)


def trim(a, sr, pad=0.06):
    loud = np.flatnonzero(np.abs(a) > 0.03 * np.abs(a).max()) if a.size else []
    if len(loud) == 0:
        return a[:0]
    return a[max(loud[0] - int(pad * sr), 0) : loud[-1] + int(pad * sr)]


def longest_gap(a, sr):
    """Longest near-silent stretch (seconds) between the first and last voiced 10 ms frames."""
    hop = sr // 100
    env = np.sqrt(np.convolve(a**2, np.ones(hop * 2) / (hop * 2), 'same'))[::hop]
    voiced = np.flatnonzero(env > 0.12 * env.max())
    if voiced.size < 2:
        return 0.0
    return (np.diff(voiced).max() - 1) / 100


def level(a, sr, rms_target=0.1, fade_s=0.01):
    a = a * (rms_target / max(np.sqrt(np.mean(a**2)), 1e-6))
    a = a * min(1.0, 0.95 / max(np.abs(a).max(), 1e-6))
    n = min(int(fade_s * sr), len(a) // 2)
    ramp = np.linspace(0, 1, n, dtype=np.float32)
    a[:n] *= ramp
    a[len(a) - n :] *= ramp[::-1]
    return a.astype(np.float32)


def write_mp3(audio, sr, src):
    dest = ROOT / 'public' / src.lstrip('/')
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(sr), '-ac', '1', '-i', 'pipe:0', '-b:a', '96k', str(dest)],
        input=audio.tobytes(),
        check=True,
    )
    print(f'  wrote {src}  ({len(audio) / sr:.1f}s)')


def lines_of(words):
    lines = {}
    for w in words:
        lines.setdefault(w['line'], []).append(w)
    return list(lines.values())


def recite(voice, verse):
    """Full verse, line by line. Returns audio and {word id: start seconds}."""
    parts, times, t = [], {}, 0.0
    lines = lines_of(verse['words'])
    for n, line in enumerate(lines):
        last = n == len(lines) - 1
        text = ''.join(w['recited'] + ('' if w.get('joinNext') else ' ') for w in line).strip() + (' ॥' if last else ' ।')
        audio = voice.say(text, CHANT, max_s=1.0 + 0.2 * len(text))
        # Words inside a line have no gaps to detect, so split the voiced span by letter count.
        voiced = len(audio) / voice.sr - 0.12
        total = sum(len(w['recited']) for w in line)
        done = 0
        for w in line:
            times[w['id']] = round(t + 0.06 + voiced * done / total, 2)
            done += len(w['recited'])
        parts.append(audio)
        t += len(audio) / voice.sr
        if not last:
            parts.append(voice.silence(LINE_GAP_S))
            t += LINE_GAP_S
    return np.concatenate(parts), times


def narrate(voice, text):
    """Hindi meaning, spoken phrase by phrase so long paragraphs stay stable."""
    phrases, cur = [], ''
    for piece in re.split(r'(?<=[।,])\s+|\s+—\s+', text):
        if cur and len(cur) + len(piece) > 110:
            phrases.append(cur)
            cur = piece
        else:
            cur = f'{cur} {piece}'.strip()
    phrases.append(cur)
    parts = []
    for p in phrases:
        parts += [voice.say(p, NARRATE, max_s=1.5 + 0.12 * len(p)), voice.silence(PHRASE_GAP_S)]
    return np.concatenate(parts[:-1])


def write_timings(times):
    for path in (ROOT / 'src' / 'data').glob('*.js'):
        with open(path, encoding='utf-8', newline='') as f:
            src = f.read()
        new = src
        for wid, t in times.items():
            new = re.sub(rf"(id: '{wid}'.*?fullMantraAt: )[^ }}]+", rf'\g<1>{t}', new)
        if new != src:
            with open(path, 'w', encoding='utf-8', newline='') as f:
                f.write(new)


def load_verses():
    js = "import('./src/data/index.js').then(m => process.stdout.write(JSON.stringify(m.mantras)))"
    out = subprocess.run(['node', '-e', js], cwd=ROOT, capture_output=True, check=True)
    return [v for m in json.loads(out.stdout.decode('utf-8')).values() for v in m['verses']]


def main(force, targets, take):
    def wanted(src, *ids):
        if not src or not src.startswith('/'):
            return False  # null or hosted URL: nothing to generate
        if targets and not targets & set(ids):
            return False
        return force or not (ROOT / 'public' / src.lstrip('/')).exists()

    voice = None
    for verse in load_verses():
        jobs = [
            ('word', w, w['audio'], (w['id'], verse['id'])) for w in verse['words']
        ] + [('full', None, verse['fullMantraAudio'], (verse['id'],)), ('meaning', None, verse['totalMeaningAudio'], (verse['id'],))]
        for kind, word, src, ids in jobs:
            if not wanted(src, *ids):
                continue
            voice = voice or Voice(take)
            if kind == 'word':
                text = PRONOUNCE.get(word['id'], word['sanskrit']) + ' ।'
                write_mp3(voice.say(text, CHANT, max_s=1.2 + 0.18 * len(text), max_gap_s=0.25), voice.sr, src)
            elif kind == 'full':
                audio, times = recite(voice, verse)
                write_mp3(audio, voice.sr, src)
                write_timings(times)
                print(f'  synced {len(times)} word timings for {verse["id"]}')
            else:
                write_mp3(narrate(voice, verse['totalMeaningHindi']), voice.sr, src)
    print('done' if voice else 'nothing to generate (use --force to regenerate)')


if __name__ == '__main__':
    args = sys.argv[1:]
    take = int(args[args.index('--take') + 1]) if '--take' in args else 0
    ids = {a for a in args if not a.startswith('--') and not a.isdigit()}
    main('--force' in args, ids, take)

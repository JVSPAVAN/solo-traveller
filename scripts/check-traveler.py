"""Check shipped traveler alpha channels. Requires FFmpeg and NumPy."""
from pathlib import Path
import subprocess
import numpy as np


def check(path, packed):
    # The central map rectangle stays inside the map throughout both source clips.
    # Inspect the encoded alpha, not a freshly computed matte, to catch bad exports.
    filters = 'crop=iw/2:ih:iw/2:0,format=gray' if packed else 'alphaextract'
    command = ['ffmpeg', '-v', 'error', '-threads', '2']
    if not packed:
        command += ['-c:v', 'libvpx-vp9']
    command += ['-i', str(path), '-vf', filters + ',scale=108:192',
                '-f', 'rawvideo', '-pix_fmt', 'gray', '-']
    result = subprocess.run(command, capture_output=True, check=True)
    frames = np.frombuffer(result.stdout, np.uint8).reshape(-1, 192, 108)
    assert len(frames) == 96, f'{path.name}: expected 96 frames, got {len(frames)}'
    for index, alpha in enumerate(frames):
        assert alpha[70:82, 46:60].min() >= 250, f'{path.name} frame {index}: map is transparent'
        assert alpha[5:20, 5:20].max() <= 5, f'{path.name} frame {index}: backdrop is opaque'
    print(f'{path.name}: all 96 frames preserve the map and transparent backdrop')


if __name__ == '__main__':
    assets = Path(__file__).resolve().parents[1] / 'public' / 'not-found'
    for theme in ('light', 'dark'):
        for packed, suffix in ((False, '-4k.webm'), (True, '-packed.mp4')):
            check(assets / f'traveler-{theme}{suffix}', packed)

"""Convert Runway clips: python scripts/prepare-traveler.py LIGHT.mp4 DARK.mp4.
Requires ffmpeg, opencv-python-headless, numpy. O(frames * pixels) time and
O(pixels) working memory; frames are streamed instead of accumulated.
"""
import sys
import subprocess
from pathlib import Path
import cv2
import numpy as np


def prepare(source, theme):
    target = Path('public/not-found')
    capture = cv2.VideoCapture(source)
    width, height = 2160, 3840
    primary = subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pixel_format','bgra','-video_size',f'{width}x{height}','-framerate','24','-i','-','-an','-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf','24','-deadline','realtime','-cpu-used','6','-row-mt','1','-threads','4',str(target / f'traveler-{theme}-4k.webm')],stdin=subprocess.PIPE)
    portable = subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pixel_format','bgr24','-video_size','2160x1920','-framerate','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(target / f'traveler-{theme}-packed.mp4')],stdin=subprocess.PIPE)
    cv2.setNumThreads(2)
    count = 0
    while count < 96:
        ok, frame = capture.read()
        if not ok:
            break
        # Connected backdrop removal protects neutral colors inside clothes/map.
        small = cv2.resize(frame, (1080,1920), interpolation=cv2.INTER_AREA)
        spread = np.ptp(small.astype(np.int16),axis=2)
        luminance = small.mean(axis=2)
        candidates = ((spread < 6) & (luminance > 90) & (luminance < 180)).astype(np.uint8)
        _, labels, stats, _ = cv2.connectedComponentsWithStats(candidates)
        background = (labels == (1 + np.argmax(stats[1:,cv2.CC_STAT_AREA]))).astype(np.uint8)
        matte = cv2.morphologyEx(1 - background, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9,9)))
        # Remove disconnected compression specks, preserving the main silhouette.
        _, foreground, sizes, _ = cv2.connectedComponentsWithStats(matte)
        matte = (foreground == (1 + np.argmax(sizes[1:,cv2.CC_STAT_AREA]))).astype(np.uint8)*255
        # Use the source-derived matte for both themes. The generated light cutout
        # omits the map and hand along an open edge; filling interior holes in that
        # cutout cannot restore them. Never replace this matte with that cutout.
        alpha = cv2.resize(matte,(width,height),interpolation=cv2.INTER_LINEAR)
        alpha = cv2.GaussianBlur(alpha,(3,3),0)
        rgba = cv2.cvtColor(frame,cv2.COLOR_BGR2BGRA)
        rgba[:,:,3] = alpha
        primary.stdin.write(rgba.tobytes())
        packed = np.concatenate([small,cv2.cvtColor(cv2.resize(alpha,(1080,1920),interpolation=cv2.INTER_AREA),cv2.COLOR_GRAY2BGR)],axis=1)
        portable.stdin.write(packed.tobytes())
        if count in [0,24,48,72,95]:
            preview = cv2.resize(rgba,(270,480))
            a=preview[:,:,3:]/255
            composite=(preview[:,:,:3]*a+np.array([245,250,255])*(1-a)).astype(np.uint8)
            cv2.imwrite(f'/tmp/traveler-{theme}-{count}.jpg',composite)
        count += 1
    capture.release()
    primary.stdin.close()
    portable.stdin.close()
    assert primary.wait() == 0 and portable.wait() == 0
    assert count == 96, f'Expected four seconds, got {count} frames'
    print(f'{theme}: {count} frames, 2160x3840, 24 fps',flush=True)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: python scripts/prepare-traveler.py LIGHT.mp4 DARK.mp4')
    for source, theme in zip(sys.argv[1:3], ['light','dark']):
        prepare(source,theme)

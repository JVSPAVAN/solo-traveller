import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

// One synchronized MP4 stores RGB on the left and its matte on the right.
// O(pixels) GPU work per decoded frame; O(1) React state and no pixel readback loop.
function packedRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) throw new Error('WebGL unavailable');
  const program = gl.createProgram();
  const shaders = [
    [gl.VERTEX_SHADER, 'attribute vec2 p; varying vec2 uv; void main(){uv=vec2((p.x+1.0)/2.0,(1.0-p.y)/2.0);gl_Position=vec4(p,0.0,1.0);}'],
    [gl.FRAGMENT_SHADER, 'precision mediump float; varying vec2 uv; uniform sampler2D frame; void main(){vec3 rgb=texture2D(frame,vec2(uv.x*0.5,uv.y)).rgb;float a=texture2D(frame,vec2(0.5+uv.x*0.5,uv.y)).r;gl_FragColor=vec4(rgb,a);}'],
  ].map(([kind, source]) => {
    const shader = gl.createShader(kind);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
    gl.attachShader(program, shader);
    return shader;
  });
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Renderer unavailable');
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.viewport(0, 0, canvas.width, canvas.height);
  return {
    draw(video) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
    },
  };
}

export default function TravelerVideo({ theme, paused, reduced }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [packed, setPacked] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const prefix = `/not-found/traveler-${theme === 'dark' ? 'dark' : 'light'}`;

  useEffect(() => {
    if (failed) return undefined;
    const video = videoRef.current;
    let disposed = false;
    let callback;
    let renderer;
    let announced = false;
    setReady(false);
    const fail = () => {
      setReady(false);
      if (packed) setFailed(true);
      else setPacked(true);
    };
    const draw = () => {
      if (disposed) return;
      try {
        if (video.readyState >= 2) {
          renderer.draw(video);
          if (!announced) { setReady(true); announced = true; }
        }
        callback = video.requestVideoFrameCallback
          ? video.requestVideoFrameCallback(draw)
          : requestAnimationFrame(draw);
      } catch { fail(); }
    };
    const loaded = () => {
      if (disposed) return;
      try {
        if (packed) {
          renderer = packedRenderer(canvasRef.current);
          draw();
        } else {
          // Some browsers decode VP9 but discard alpha; detect that once per load.
          const probe = document.createElement('canvas');
          probe.width = probe.height = 1;
          const context = probe.getContext('2d', { willReadFrequently: true });
          context.drawImage(video, 0, 0, 1, 1, 0, 0, 1, 1);
          if (context.getImageData(0, 0, 1, 1).data[3] > 0) { fail(); return; }
          setReady(true);
        }
      } catch { fail(); }
    };
    video.addEventListener('loadeddata', loaded, { once: true });
    video.addEventListener('error', fail);
    if (video.readyState >= 2) {
      video.removeEventListener('loadeddata', loaded);
      loaded();
    }
    return () => {
      disposed = true;
      video.removeEventListener('loadeddata', loaded);
      video.removeEventListener('error', fail);
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(callback);
      else cancelAnimationFrame(callback);
      renderer?.dispose();
      video.pause();
    };
  }, [packed, failed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;
    if (paused || reduced || failed) video.pause();
    else video.play().catch(() => { if (!cancelled) setReady(false); });
    return () => { cancelled = true; };
  }, [paused, reduced, packed, failed]);

  return <div className="nf-traveler" aria-hidden="true">
    <div className="nf-traveler-still" style={{ opacity: ready && !failed ? 0 : 1 }} />
    {!failed && <>
      <video key={packed ? 'packed' : 'alpha'} ref={videoRef} className="nf-traveler-video" src={`${prefix}${packed ? '-packed.mp4' : '-4k.webm'}`} muted playsInline loop preload="auto" disablePictureInPicture style={{ opacity: ready && !packed ? 1 : 0 }} />
      {packed && <canvas ref={canvasRef} className="nf-traveler-canvas" width="1080" height="1920" style={{ opacity: ready ? 1 : 0 }} />}
    </>}
  </div>;
}

TravelerVideo.propTypes = { theme: PropTypes.string.isRequired, paused: PropTypes.bool.isRequired, reduced: PropTypes.bool.isRequired };

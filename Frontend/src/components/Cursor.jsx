import { useEffect, useRef } from 'react';
import './Cursor.css';

export default function Cursor() {
  const curRef = useRef(null);
  const ringRef = useRef(null);
  const txtRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (curRef.current) {
        curRef.current.style.left = mx + 'px';
        curRef.current.style.top = my + 'px';
      }
      if (txtRef.current) {
        txtRef.current.style.left = mx + 'px';
        txtRef.current.style.top = my + 'px';
      }
    };

    const lerp = () => {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      requestAnimationFrame(lerp);
    };

    document.addEventListener('mousemove', onMove);
    const raf = requestAnimationFrame(lerp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef} />
      <div id="cur-ring" ref={ringRef} />
      <div id="cur-text" ref={txtRef}>CONNECT</div>
    </>
  );
}
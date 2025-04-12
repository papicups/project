import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Howl } from 'howler';

// Preload all sounds at the start
const preloadSounds = () => {
  const sounds = [
    '/sonidos/bingo.mp3',
    '/sonidos/exit.mp3',
    '/sonidos/push.mp3',
    '/sonidos/spin.mp3',
    '/sonidos/welcome.mp3',
    '/sonidos/win.mp3'
  ];

  sounds.forEach((sound) => {
    new Howl({ src: [sound], preload: true });
  });
};

preloadSounds();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

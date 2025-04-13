import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Howl } from 'howler';
import { EmailReporter } from './services/EmailReporter';

// Preload all sounds at the start
const preloadSounds = () => {
  const base = import.meta.env.BASE_URL;
  const sounds = [
    `${base}sonidos/bingo.mp3`,
    `${base}sonidos/exit.mp3`,
    `${base}sonidos/push.mp3`,
    `${base}sonidos/spin.mp3`,
    `${base}sonidos/welcome.mp3`,
    `${base}sonidos/win.mp3`
  ];

  sounds.forEach((sound) => {
    new Howl({ src: [sound], preload: true });
  });
};

preloadSounds();

// Initialize email reporting service
EmailReporter.getInstance().initialize().catch(console.error);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

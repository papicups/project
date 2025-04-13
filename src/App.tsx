import { useEffect } from 'react';
import SlotMachine from './components/SlotMachine';
import { Howl } from 'howler';
import { EmailReporter } from './services/EmailReporter';
import { UserTracker } from './services/UserTracker';

function App() {
  useEffect(() => {
    const base = import.meta.env.BASE_URL;

    // Initialize email reporter
    EmailReporter.getInstance().initialize();
    
    // Track user visit using a fingerprint or session ID
    const sessionId = crypto.randomUUID();
    UserTracker.getInstance().trackVisit(sessionId);

    const welcomeSound = new Howl({
      src: [`${base}sonidos/welcome.mp3`],
      preload: true,
      volume: 0.7
    });
    
    const exitSound = new Howl({
      src: [`${base}sonidos/exit.mp3`],
      preload: true,
      volume: 0.7
    });

    // Play welcome sound on mount if allowed by user interaction
    const playWelcomeSound = () => {
      welcomeSound.play();
    };

    // Add event listener for user interaction to play welcome sound
    document.addEventListener('click', playWelcomeSound, { once: true });

    // Play exit sound on unmount
    return () => {
      exitSound.play();
    };
  }, []);

  return (
    <div>
      <SlotMachine />
    </div>
  );
}

export default App;
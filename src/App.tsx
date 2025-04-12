import React, { useEffect } from 'react';
import SlotMachine from './components/SlotMachine';

function App() {
  useEffect(() => {
    const welcomeSound = new Audio('/sonidos/welcome.mp3');
    const exitSound = new Audio('/sonidos/exit.mp3');

    // Play welcome sound on mount if allowed by user interaction
    const playWelcomeSound = () => {
      welcomeSound.play().catch((error) => {
        console.error('Error playing welcome sound:', error);
      });
    };

    // Add event listener for user interaction to play welcome sound
    document.addEventListener('click', playWelcomeSound, { once: true });

    // Play exit sound on unmount
    return () => {
      exitSound.play().catch((error) => {
        console.error('Error playing exit sound:', error);
      });
    };
  }, []);

  return (
    <div>
      <SlotMachine />
    </div>
  );
}

export default App;
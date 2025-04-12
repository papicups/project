import { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { Howl } from 'howler';
import { Coffee, Trophy } from 'lucide-react';
import * as THREE from 'three';

const sounds = {
  spin: new Howl({
    src: ['./sonidos/spin.mp3'], // Change to relative path
    preload: true,
    volume: 0.7,
    onload: () => console.log('Spin sound loaded'),
    onloaderror: (id, error) => console.error("Error loading spin sound:", error)
  }),
  win: new Howl({
    src: ['./sonidos/win.mp3'], // Change to relative path
    preload: true,
    volume: 0.8,
    onload: () => console.log('Win sound loaded'),
    onloaderror: (id, error) => console.error("Error loading win sound:", error),
    onend: function() {
      (window as any).isWinSoundPlaying = false;
      (window as any).canSpin = true;
    }
  }),
  push: new Howl({
    src: ['./sonidos/push.mp3'], // Change to relative path
    preload: true,
    volume: 0.5,
    onload: () => console.log('Push sound loaded'),
    onloaderror: (id, error) => console.error("Error loading push sound:", error)
  })
};

// Add sound check function
const playSoundWithCheck = (sound: Howl) => {
  if (sound.state() === 'loaded') {
    sound.play();
  } else {
    console.error('Sound not loaded properly');
  }
};

// Add a function to manage win sound
const playWinSound = () => {
  if (!(window as any).isWinSoundPlaying) {
    (window as any).isWinSoundPlaying = true;
    (window as any).canSpin = false;
    sounds.win.play();
  }
};

function RotatingTitle() {
  const titleRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const animation = () => {
      if (titleRef.current) {
        titleRef.current.rotation.y += 0.005;
      }
    };

    const animationId = setInterval(animation, 16);
    return () => clearInterval(animationId);
  }, []);

  return (
    <group ref={titleRef} position={[0, -2, 0]} scale={[0.3, 0.3, 0.3]}>
      <Center>
        <Text3D
          font="/fonts/optimer_regular.typeface.json"
          size={2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          Casino Quiniela PAPIWEB
          <meshPhysicalMaterial
            color="#ffd700"
            metalness={1}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1}
          />
        </Text3D>
      </Center>
    </group>
  );
}

function Machine() {
  const boxRef = useRef<THREE.Group>(null);
  const [numbers, setNumbers] = useState(['00', '00', '00']);
  const [isSpinning, setIsSpinning] = useState(false);
  const [flash, setFlash] = useState(false);

  // Create enhanced metallic gold material with more brilliance
  const goldMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffd700'),
    metalness: 1,
    roughness: 0.1, // Reduced roughness for more shine
    envMapIntensity: 2, // Increased environment map intensity
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    reflectivity: 1, // Maximum reflectivity
    transmission: 0.1, // Slight transmission for extra shine
    specularIntensity: 1, // Maximum specular intensity
    specularColor: new THREE.Color('#fffacd'), // Light yellow specular highlight
  });

  const spin = () => {
    // Don't spin if already spinning or win sound is playing
    if (isSpinning || !(window as any).canSpin) return;
    
    setIsSpinning(true);
    playSoundWithCheck(sounds.spin);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setNumbers(numbers.map(() => 
        Math.floor(Math.random() * 100).toString().padStart(2, '0')
      ));

      spins++;
      if (spins >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        const isJackpot = Math.random() < 0.1;
        
        if (isJackpot) {
          const jackpotNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          setNumbers([jackpotNumber, jackpotNumber, jackpotNumber]);
          playWinSound();
          setFlash(true);
          setTimeout(() => setFlash(false), 3000);
        } else {
          (window as any).canSpin = true;
        }
      }
    }, 100);
  };

  useEffect(() => {
    const button = document.querySelector('button');
    if (button) {
      button.addEventListener('click', spin);
    }
    return () => {
      if (button) {
        button.removeEventListener('click', spin);
      }
    };
  }, []);

  useEffect(() => {
    const animation = () => {
      if (boxRef.current) {
        boxRef.current.rotation.y = (boxRef.current.rotation.y || 0) + 0.005;
      }
    };

    const animationId = setInterval(animation, 16);
    return () => clearInterval(animationId);
  }, []);

  return (
    <group ref={boxRef}>
      {/* Main slot machine body with enhanced lighting */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 2, 0.3]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>

      {/* Display numbers */}
      {numbers.map((number, i) => (
        <Center key={i} position={[(i - 1) * 1.2, 0, 0.2]}>
          <Text3D
            font="/fonts/optimer_regular.typeface.json"
            size={0.5}
            height={1}
          >
            {number}
            <meshPhysicalMaterial
              color={flash ? '#ff0000' : '#ffd700'}
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </Text3D>
        </Center>
      ))}
    </group>
  );
}

function DigitalCounter({ onPush }: { onPush: (number: number) => void }) {
  const [count, setCount] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [showBig, setShowBig] = useState(false);
  const [bgColor, setBgColor] = useState('#ff0000');

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCount((prev) => (prev + 1) % 100);
        setBgColor(`hsl(${Math.random() * 360}, 100%, 50%)`);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handlePush = () => {
    setPaused(true);
    setShowBig(true);
    playSoundWithCheck(sounds.push);
    onPush(count);

    setTimeout(() => {
      setShowBig(false);
      setPaused(false);
    }, 2000);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-4">
      <div 
        className="bg-black p-4 rounded-lg shadow-lg transition-all duration-300"
        style={{ transform: showBig ? 'scale(1.5)' : 'scale(1)' }}
      >
        <div 
          className="font-mono text-4xl font-bold transition-colors duration-200"
          style={{ color: bgColor }}
        >
          {count.toString().padStart(2, '0')}
        </div>
      </div>
      <button
        onClick={handlePush}
        disabled={isPaused}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        PUSH
      </button>
    </div>
  );
}

export default function SlotMachine() {
  const [jackpot] = useState({ gold: 100000, silver: 50000 });
  const [winningNumbers, setWinningNumbers] = useState<string[]>([]);
  const [pushedNumbers, setPushedNumbers] = useState<number[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  useEffect(() => {
    // Cargar imágenes aleatorias desde la carpeta public/fotos
    const loadRandomBackground = () => {
      const imageCount = 5; // Número de imágenes en la carpeta
      const randomIndex = Math.floor(Math.random() * imageCount) + 1;
      setBackgroundImage(`/fotos/image${randomIndex}.jpg`);
    };

    loadRandomBackground();
  }, []);

  const updateWinningNumbers = (numbers: string[]) => {
    setWinningNumbers(prev => [...numbers, ...prev].slice(0, 5));
  };

  const handlePush = (number: number) => {
    setPushedNumbers(prev => [number, ...prev].slice(0, 5));
  };

  useEffect(() => {
    (window as any).canSpin = true;
    (window as any).isWinSoundPlaying = false;
    return () => {
      sounds.win.stop();
    };
  }, []);

  return (
    <div
      className="h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Digital Counter */}
        <DigitalCounter onPush={handlePush} />

        {/* Pushed Numbers Display */}
        {pushedNumbers.length > 0 && (
          <div className="fixed top-20 right-4 bg-black bg-opacity-80 p-4 rounded-lg">
            <h3 className="text-white text-sm font-bold mb-2">Números Push</h3>
            <div className="flex flex-col gap-2">
              {pushedNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-red-500 to-red-700 px-3 py-1 rounded text-white font-mono font-bold text-center"
                >
                  {number.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Jackpot Display */}
        <div className="mb-8 flex justify-center gap-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              <span className="font-bold">Ganador</span>
            </div>
            <div className="text-2xl font-bold text-center">
              Éxitos {/* Cambiado a texto */}
            </div>
          </div>
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              <span className="font-bold">Buena suerte</span>
            </div>
            <div className="text-2xl font-bold text-center">
              Caburé {/* Cambiado a texto */}
            </div>
          </div>
        </div>

        {/* Winning Numbers Display */}
        {winningNumbers.length > 0 && (
          <div className="mb-8 bg-black bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-white text-center font-bold mb-2">Últimos Números Ganadores</h3>
            <div className="flex justify-center gap-4">
              {winningNumbers.map((number, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-2 rounded-lg min-w-[60px] text-center font-bold"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-[60vh] w-full">
          <Canvas camera={{ position: [0, 0, 5] }}>
            {/* Enhanced lighting setup */}
            <ambientLight intensity={3} />
            <hemisphereLight 
              intensity={0.4}
              groundColor={new THREE.Color("#080820")}
              color={new THREE.Color("#FFBB55")}
            />
            
            {/* Main dramatic lighting */}
            <spotLight
              position={[-5, 5, 2]}
              angle={0.4}
              penumbra={0.5}
              intensity={5.5}
              castShadow
              color="#ffd700"
            />
            <spotLight
              position={[5, 5, 2]}
              angle={0.4}
              penumbra={0.5}
              intensity={3.5}
              castShadow
              color="#ffe55b"
            />
            
            {/* Fill lights for better details */}
            <pointLight position={[-3, -2, 4]} intensity={0.5} color="#ff9900" />
            <pointLight position={[3, -2, 4]} intensity={0.5} color="#ff9900" />
            
            {/* Rest of the scene */}
            <Machine />
            <RotatingTitle />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-8">
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all"
            onClick={() => {
              const newNumbers = Array(3).fill(0).map(() => 
                Math.floor(Math.random() * 100).toString().padStart(2, '0')
              );
              updateWinningNumbers(newNumbers);
            }}
          >
            ¡SUERTE!
          </button>
          
          <a
            href="https://link.mercadopago.com.ar/papiweb"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Coffee className="w-6 h-6" />
            <span>¡A voluntad por MercadoPago!</span>
          </a>
          
          <div className="text-white text-center">
            <p className="text-xl font-bold">Papiweb Desarrollos Informáticos</p>
            <p className="text-sm opacity-75">© 2024 Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
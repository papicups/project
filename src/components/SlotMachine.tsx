import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import { Howl } from 'howler';
import { Coffee, Trophy } from 'lucide-react';
import * as THREE from 'three';

interface CustomWindow extends Window {
  canSpin: boolean;
  isWinSoundPlaying: boolean;
}

const base = import.meta.env.BASE_URL;

const sounds = {
  spin: new Howl({
    src: [`${base}sonidos/spin.mp3`],
    preload: true,
    volume: 0.7,
    onload: () => console.log('Spin sound loaded'),
    onloaderror: (_, error) => console.error("Error loading spin sound:", error)
  }),
  win: new Howl({
    src: [`${base}sonidos/win.mp3`],
    preload: true,
    volume: 0.8,
    onload: () => console.log('Win sound loaded'),
    onloaderror: (_, error) => console.error("Error loading win sound:", error),
    onend: function() {
      ((window as unknown) as CustomWindow).isWinSoundPlaying = false;
      ((window as unknown) as CustomWindow).canSpin = true;
    }
  }),
  push: new Howl({
    src: [`${base}sonidos/push.mp3`],
    preload: true,
    volume: 0.5,
    onload: () => console.log('Push sound loaded'),
    onloaderror: (_, error) => console.error("Error loading push sound:", error)
  }),
  bingo: new Howl({
    src: [`${base}sonidos/bingo.mp3`],
    preload: true,
    volume: 0.5,
    onload: () => console.log('Bingo sound loaded'),
    onloaderror: (_, error) => console.error("Error loading bingo sound:", error)
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
  if (!((window as unknown) as CustomWindow).isWinSoundPlaying) {
    ((window as unknown) as CustomWindow).isWinSoundPlaying = true;
    ((window as unknown) as CustomWindow).canSpin = false;
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
          font={`${base}fonts/optimer_regular.typeface.json`}
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

function FeatherCabure({ position = [-4, 0, 0] }: { position?: [number, number, number] }) {
  const featherRef = useRef<THREE.Group>(null);
  const sparklesRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(0);

  useFrame((state) => {
    if (featherRef.current) {
      featherRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      featherRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      featherRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
      const swayAmount = Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
      featherRef.current.rotation.x = swayAmount;
      const pulseIntensity = (Math.sin(state.clock.elapsedTime * 1.2) + 1) / 2;
      setGlowIntensity(pulseIntensity);
    }

    if (sparklesRef.current) {
      sparklesRef.current.children.forEach((sparkle, i) => {
        const offset = i * (Math.PI / 8);
        const radius = 1.5 + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.3;
        const heightOffset = Math.sin(state.clock.elapsedTime * 1.2 + offset) * 0.5;
        sparkle.position.x = Math.cos(state.clock.elapsedTime + offset) * radius * 0.8;
        sparkle.position.y = Math.sin(state.clock.elapsedTime * 0.8 + offset) * radius + heightOffset;
        sparkle.position.z = Math.sin(state.clock.elapsedTime * 0.5 + offset) * 0.3;
        sparkle.rotation.z += 0.01;
        sparkle.scale.setScalar(0.5 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.3);
      });
    }

    if (glowRef.current) {
      glowRef.current.rotation.z += 0.001;
      glowRef.current.rotation.y += 0.002;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <group ref={featherRef} position={position} scale={[0.2625, 0.2625, 0.2625]}>
      <group ref={glowRef}>
        <pointLight position={[0, 0, 0]} distance={5} intensity={2} color="#FFD700" />
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshPhysicalMaterial
            color="#FFD700"
            transparent
            opacity={0.1}
            emissive="#FFD700"
            emissiveIntensity={glowIntensity * 0.3}
          />
        </mesh>
      </group>

      <mesh>
        <cylinderGeometry args={[0.06, 0.03, 20, 12]} />
        <meshPhysicalMaterial 
          color="#2A1810"
          metalness={0.3}
          roughness={0.7}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          emissive="#8B4513"
          emissiveIntensity={glowIntensity * 0.2}
          envMapIntensity={2}
        />
      </mesh>

      {Array.from({ length: 50 }).map((_, i) => (
        <group key={i} position={[0, i * 0.35 - 9, 0]} rotation={[0, 0, Math.PI * 0.5]}>
          <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI * 0.15]}>
            <planeGeometry args={[3, 0.12]} />
            <meshPhysicalMaterial 
              color="#4A3728"
              metalness={0.4}
              roughness={0.6}
              transparent
              opacity={0.95}
              side={THREE.DoubleSide}
              emissive="#8B4513"
              emissiveIntensity={glowIntensity * 0.15}
              envMapIntensity={2}
            />
          </mesh>
          <mesh position={[0.05, 0, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
            <planeGeometry args={[3, 0.12]} />
            <meshPhysicalMaterial 
              color="#3D2B1F"
              metalness={0.4}
              roughness={0.6}
              transparent
              opacity={0.95}
              side={THREE.DoubleSide}
              emissive="#8B4513"
              emissiveIntensity={glowIntensity * 0.15}
              envMapIntensity={2}
            />
          </mesh>
          {Array.from({ length: 12 }).map((_, j) => (
            <group key={j}>
              <mesh 
                position={[-1.2 + j * 0.2, 0, 0.01]} 
                rotation={[0, 0, Math.PI * 0.1]}
                scale={[1, 0.8, 1]}
              >
                <planeGeometry args={[0.08, 0.06]} />
                <meshPhysicalMaterial 
                  color="#5C4033"
                  metalness={0.3}
                  roughness={0.8}
                  transparent
                  opacity={0.7}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      <group ref={sparklesRef}>
        {Array.from({ length: 15 }).map((_, i) => (
          <mesh key={i} position={[0, 0, 0]}>
            <octahedronGeometry args={[0.08]} />
            <meshPhysicalMaterial
              color="#FFFFFF"
              metalness={1}
              roughness={0.1}
              transmission={0.9}
              thickness={0.5}
              envMapIntensity={8}
              clearcoat={1}
              clearcoatRoughness={0.1}
              emissive="#FFD700"
              emissiveIntensity={glowIntensity}
            />
          </mesh>
        ))}
      </group>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        return (
          <spotLight
            key={i}
            position={[
              Math.cos(angle) * 1.2,
              Math.sin(angle) * 1.2,
              0.5
            ]}
            angle={0.3}
            penumbra={0.9}
            intensity={glowIntensity * 1.2}
            color="#FFD700"
            distance={5}
          />
        );
      })}
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
    if (isSpinning || !((window as unknown) as CustomWindow).canSpin) return;
    
    setIsSpinning((prev) => {
      if (prev) return prev; // Prevent re-triggering if already spinning
      return true;
    });
    playSoundWithCheck(sounds.spin);

    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setNumbers((prevNumbers) => 
        prevNumbers.map(() => Math.floor(Math.random() * 100).toString().padStart(2, '0'))
      );

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
          ((window as unknown) as CustomWindow).canSpin = true;
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
  }, [spin]);

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
            font={`${base}fonts/optimer_regular.typeface.json`}
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
  const [winningNumbers, setWinningNumbers] = useState<string[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  const [showFeather, setShowFeather] = useState(false);

  // Check for repeated numbers
  const checkRepeatedNumbers = (numbers: string[]) => {
    const counts: { [key: string]: number } = {};
    numbers.forEach(num => {
      counts[num] = (counts[num] || 0) + 1;
    });
    
    return Object.values(counts).some(count => count >= 2);  // Changed from 3 to 2
  };

  useEffect(() => {
    if (checkRepeatedNumbers(winningNumbers)) {
      setShowFeather(true);
      playSoundWithCheck(new Howl({
        src: [`${base}sonidos/welcome.mp3`],
        volume: 0.7
      }));
      
      setTimeout(() => {
        setShowFeather(false);
      }, 5000);
    }
  }, [winningNumbers]);

  useEffect(() => {
    // Cargar imágenes aleatorias desde la carpeta public/fotos
    const loadRandomBackground = () => {
      const imageCount = 5; // Número de imágenes en la carpeta
      const randomIndex = Math.floor(Math.random() * imageCount) + 1;
      setBackgroundImage(`${base}fotos/image${randomIndex}.jpg`);
    };

    loadRandomBackground();
  }, []);

  const updateWinningNumbers = (numbers: string[]) => {
    setWinningNumbers(prev => [...numbers, ...prev].slice(0, 5));
  };
  useEffect(() => {
    const customWindow = window as unknown as CustomWindow;
    customWindow.canSpin = true;
    customWindow.isWinSoundPlaying = false;
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
        <DigitalCounter onPush={(number) => setWinningNumbers((prev) => [...prev, number.toString().padStart(2, '0')].slice(0, 5))} />

        {/* Pushed Numbers Display */}
        {/* Removed unused Pushed Numbers Display */}
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
            {showFeather && <FeatherCabure />}
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
            onClick={() => playSoundWithCheck(sounds.bingo)}
          >
            <Coffee className="w-6 h-6" />
            <span>¡A voluntad por MercadoPago!</span>
          </a>
          
          <div
            className="fixed bottom-0 w-full bg-black bg-opacity-75 text-white text-center py-4"
          >
            <div className="text-center space-y-2 relative z-[999]">
              <div className="animate-fade-in-up delay-100">
                <p className="text-xl font-bold text-gray-100 drop-shadow-lg hover:scale-105 transition-all duration-300">
                  Papiweb Desarrollos Informáticos
                </p>
              </div>
              
              <div className="animate-fade-in-up delay-300">
                <p className="text-sm text-gray-300/95 font-light tracking-wide">
                  © 2024 Todos los derechos reservados
                </p>
              </div>

              <style>{`
                @keyframes fade-in-up {
                  0% {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                .animate-fade-in-up {
                  animation: fade-in-up 0.8s ease-out forwards;
                }
                
                .delay-100 { animation-delay: 100ms; }
                .delay-300 { animation-delay: 300ms; }
                
                .drop-shadow-lg {
                  filter: drop-shadow(0 4px 3px rgb(0 0 0 / 0.3));
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
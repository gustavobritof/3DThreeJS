import React, { useState, useEffect } from 'react';
import 'aframe';
import SceneDetail from './Scene2.jsx';

export default function Museum() {
  const [activeInfo, setActiveInfo] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [currentScene, setCurrentScene] = useState('museum'); // 'museum' ou 'detail'
  const [selectedExhibit, setSelectedExhibit] = useState(null);

  const exhibits = [
    {
      id: 'hubble',
      pos: '-5 0 -5',
      model: '/models/hubble.glb',
      scale: '0.0003 0.0003 0.0003',
      label: '🔭 Hubble',
      labelPos: '0 0.2 0.61',
      labelRot: '0 0 0',
      title: 'Hubble Space Telescope',
      desc: 'O telescópio espacial Hubble revolucionou nossa visão do universo.',
      duration: 10000,
    },
    {
      id: 'jwst',
      pos: '0 0 -5',
      model: '/models/jwst_james_webb_space_telescope.glb',
      scale: '0.05 0.05 0.05',
      label: 'JWST',
      labelPos: '0 0.2 0.61',
      labelRot: '0 0 0',
      title: 'James Webb Space Telescope',
      desc: 'O telescópio espacial mais avançado, observando o universo em infravermelho.',
      duration: 10000,
    },
    {
      id: 'saturnv',
      pos: '5 0 -5',
      model: '/models/saturnVCorrect.glb',
      scale: '0.3 0.3 0.3',
      label: '🚀 Saturn V',
      labelPos: '0 0.2 0.61',
      labelRot: '0 0 0',
      title: 'Saturn V Rocket',
      desc: 'O foguete mais poderoso já construído, levou os astronautas à Lua.',
      duration: 10000,
    },
    {
      id: 'iss',
      pos: '-5 0 0',
      model: '/models/ISS_Correct.glb',
      scale: '0.1 0.1 0.1',
      label: '🌍 ISS',
      labelPos: '0.61 0.2 0',
      labelRot: '0 90 0',
      title: 'International Space Station',
      desc: 'Laboratório orbital onde astronautas de vários países trabalham.',
      duration: 10000,
    }
  ];

  useEffect(() => {
    exhibits.forEach((item) => {
      const entity = document.querySelector(`[data-exhibit="${item.id}"]`);
      if (entity) {
        entity.addEventListener('click', () => {
          setActiveInfo(item);
        });
        entity.addEventListener('mouseenter', () => setHoveredId(item.id));
        entity.addEventListener('mouseleave', () => setHoveredId(null));
      }
    });
  }, []);

  const handleViewDetail = (exhibit) => {
    setSelectedExhibit(exhibit);
    setCurrentScene('detail');
    setActiveInfo(null);
  };

  const handleBackToMuseum = () => {
    setCurrentScene('museum');
    setSelectedExhibit(null);
  };

  const getScale = (baseScaleStr, isHovered) => {
    if (!isHovered) return baseScaleStr;
    const [x, y, z] = baseScaleStr.split(' ').map(parseFloat);
    return `${x * 1.1} ${y * 1.1} ${z * 1.1}`;
  };

  // Se a cena de detalhe está ativa
  if (currentScene === 'detail') {
    return <SceneDetail exhibit={selectedExhibit} onBack={handleBackToMuseum} />;
  }

  // Cena principal do museu
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <a-scene>
        <a-assets>
          <img id="skyTexture" src="/images/sky.jpg" alt="Sky Texture" />
        </a-assets>

        {/* Câmera e Cursor */}
        <a-entity id="rig" position="0 0 0">
          <a-camera>
            <a-cursor
              id="cursor"
              color={hoveredId ? "green" : "white"}
              raycaster="objects: .clickable"
            ></a-cursor>
          </a-camera>
        </a-entity>

        {/* Ambiente */}
        <a-light type="ambient" color="#fff" intensity="0.1"></a-light>
        <a-light type="directional" color="#fff" intensity="1" position="5 10 5"></a-light>
        <a-plane rotation="-90 0 0" width="50" height="50" color="#808080" roughness="0.8"></a-plane>
        <a-sky color="#1a1a2e"></a-sky>

        {/* Paredes */}
        <a-box position="0 2.5 -10" width="20" height="5" depth="0.2" color="#f5f5dc" roughness="0.7"></a-box>
        <a-box position="-10 2.5 0" width="0.2" height="5" depth="20" color="#f5f5dc" roughness="0.7"></a-box>
        <a-box position="10 2.5 0" width="0.2" height="5" depth="20" color="#f5f5dc" roughness="0.7"></a-box>

        {/* Pinturas */}
        {[
          { pos: '-8 2 -9.9', color: '#ff6b6b' },
          { pos: '-4 2 -9.9', color: '#4ecdc4' },
          { pos: '0 2 -9.9', color: '#ffe66d' },
          { pos: '4 2 -9.9', color: '#95e1d3' },
          { pos: '8 2 -9.9', color: '#f38181' }
        ].map((paint, index) => (
          <a-box key={index} position={paint.pos} width="1.5" height="0.1" depth="2" color={paint.color} roughness="0.3" rotation="90 0 0"></a-box>
        ))}

        {/* Exibições */}
        {exhibits.map((item) => (
          <a-entity key={item.id} position={item.pos} data-exhibit={item.id}>
            <a-box position="0 0.5 0" width="1.2" height="1" depth="1.2" color="#2c3e50" roughness="0.5"></a-box>
            <a-box position="0 1.2 0" width="1" height="0.2" depth="1" color="#34495e" roughness="0.3"></a-box>

            <a-entity
              gltf-model={item.model}
              position="0 2 0"
              scale={getScale(item.scale, hoveredId === item.id)}
              class="clickable"
              animation={`property: rotation; to: 0 360 0; loop: true; dur: ${item.duration}; easing: linear`}
            ></a-entity>

            <a-plane position={item.labelPos} width="1" height="0.3" color="#ecf0f1" roughness="0.4" rotation={item.labelRot}></a-plane>
            <a-text value={item.label} position={item.labelPos} align="center" anchor="center" color="#2c3e50" rotation={item.labelRot}></a-text>
          </a-entity>
        ))}

        {/* Em Breve */}
        <a-entity position="5 0 0">
          <a-box position="0 0.5 0" width="1.2" height="1" depth="1.2" color="#2c3e50" roughness="0.5"></a-box>
          <a-box position="0 1.2 0" width="1" height="0.2" depth="1" color="#34495e" roughness="0.3"></a-box>
          <a-plane position="-0.61 0.2 0" width="1" height="0.3" color="#ecf0f1" roughness="0.4" rotation="0 -90 0"></a-plane>
          <a-text value="Em Breve" position="-0.61 0.2 0" align="center" anchor="center" color="#2c3e50" rotation="0 -90 0"></a-text>
        </a-entity>
      </a-scene>

      {/* Painel de Informações */}
      {activeInfo && (
        <div style={styles.infoPanel}>
          <button style={styles.closeBtn} onClick={() => setActiveInfo(null)}>×</button>
          <h3 style={styles.title}>{activeInfo.title}</h3>
          <p style={styles.desc}>{activeInfo.desc}</p>
          <button
            style={styles.actionBtn}
            onClick={() => handleViewDetail(activeInfo)}
          >
            Ver em 3D
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  infoPanel: {
    position: 'absolute',
    top: '50%',
    right: '20px',
    transform: 'translateY(-50%)',
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    maxWidth: '300px',
    zIndex: 1000,
    fontFamily: 'Arial, sans-serif'
  },
  title: { margin: '0 0 10px 0', color: '#1976d2' },
  desc: { margin: '0 0 15px 0', color: '#333', lineHeight: '1.5' },
  closeBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  actionBtn: {
    width: '100%',
    padding: '8px 16px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  }
};
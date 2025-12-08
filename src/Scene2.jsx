import React, { useEffect, useState } from 'react';
import 'aframe';

export default function MuseuGaleria({ exhibit, onBack }) {
    console.log('Exhibit recebido em MuseuGaleria:', exhibit);
    const [activeInfo, setActiveInfo] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    // Converter scale string para objeto
    const getScale = () => {
        const [x, y, z] = exhibit.scale.split(' ').map(parseFloat);
        return { x, y, z };
    };

    const scale = getScale();

    const exhibits = [
        {
            id: 'historia',
            title: 'História da Exploração Espacial',
            desc: 'Uma jornada através dos marcos mais importantes da exploração humana do espaço.',
            image: '/images/sky.jpg'
        },
        {
            id: 'tecnologia',
            title: 'Tecnologia Aeroespacial',
            desc: 'Descubra as inovações tecnológicas que tornaram possível alcançar as estrelas.',
            image: '/images/sky.jpg'
        },
        {
            id: 'missoes',
            title: 'Missões Espaciais Icônicas',
            desc: 'Conheça as missões que mudaram nossa compreensão do universo.',
            image: '/images/sky.jpg'
        },
        {
            id: 'futuro',
            title: 'O Futuro da Astronomia',
            desc: 'Explore as possibilidades e desafios da próxima era de descobertas.',
            image: '/images/sky.jpg'
        }
    ];

    useEffect(() => {
        // Painéis informativos
        exhibits.forEach((item) => {
            const painel = document.querySelector(`[data-exhibit="${item.id}"]`);
            if (painel) {
                const clickHandler = () => setActiveInfo(item);
                painel.addEventListener('click', clickHandler);

                return () => {
                    painel.removeEventListener('click', clickHandler);
                };
            }
        });

        // Botão Voltar
        const btnVoltar = document.querySelector('[data-action="voltar"]');
        if (btnVoltar) {
            btnVoltar.addEventListener('click', onBack);

            return () => {
                btnVoltar.removeEventListener('click', onBack);
            };
        }
    }, [onBack, exhibits]);

    return (
        <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <a-scene background="color: #0a0e27">
                {/* Câmera Corrigida */}
                <a-entity camera position="0 1.6 5" look-controls wasd-controls="acceleration: 25">
                    <a-entity cursor="fuse: true; fuseTimeout: 500" position="0 0 -1" scale="0.01 0.01 0.01"
                        raycaster="objects: .clickable">
                        <a-ring color="#00d4ff" radiusInner="0.02" radiusOuter="0.03"></a-ring>
                    </a-entity>
                </a-entity>

                {/* PISO */}
                <a-plane color="#1a1a3e" rotation="-90 0 0" width="18" height="16" position="0 0 0" shadow></a-plane>
                <a-plane color="#2d1b4e" rotation="-90 0 0" width="8" height="8" position="0 0.01 0" shadow></a-plane>

                {/* TETO - Efeito de céu estrelado */}
                <a-plane color="#000814" rotation="90 0 0" width="18" height="16" position="0 3.8 0"></a-plane>

                {/* PAREDES */}
                <a-plane color="#0f0f1e" width="18" height="3.8" position="0 1.9 -8"></a-plane>
                <a-box color="#00d4ff" width="18" height="0.15" depth="0.1" position="0 3.7 -8.03" emissive="#00d4ff"></a-box>

                <a-plane color="#1a1a3e" width="16" height="3.8" position="-9 1.9 0" rotation="0 90 0"></a-plane>
                <a-box color="#00d4ff" width="16" height="0.1" depth="0.1" position="-9 3.75 0" rotation="0 90 0" emissive="#00d4ff"></a-box>

                <a-plane color="#1a1a3e" width="16" height="3.8" position="9 1.9 0" rotation="0 90 0"></a-plane>
                <a-box color="#00d4ff" width="16" height="0.1" depth="0.1" position="9 3.75 0" rotation="0 90 0" emissive="#00d4ff"></a-box>

                {/* ILUMINAÇÃO */}
                <a-light type="ambient" intensity="0.6" color="#00d4ff"></a-light>
                <a-light type="directional" intensity="1" position="3 4 3" color="#ffffff"></a-light>
                <a-light type="point" intensity="1" position="-5 2.5 -3" color="#00d4ff"></a-light>
                <a-light type="point" intensity="1" position="5 2.5 -3" color="#00d4ff"></a-light>

                {/* PEDESTAL CENTRAL */}
                <a-cylinder color="#1a1a1a" radius="0.85" height="0.5" position="0 0.0 -3" shadow></a-cylinder>
                <a-cylinder color="#00d4ff" radius="0.9" height="0.12" position="0 0.5 -3" shadow emissive="#00d4ff"></a-cylinder>

                {/* MODELO CENTRAL - POSIÇÃO CORRIGIDA */}
                <a-entity position="0 1.2 -3">
                    <a-entity
                        gltf-model={exhibit.model}
                        scale={`${scale.x} ${scale.y} ${scale.z}`}
                        animation={`property: rotation; to: 0 360 0; loop: true; dur: ${exhibit.duration}; easing: linear`}
                        shadow
                    ></a-entity>
                </a-entity>

                {/* PLACA */}
                {/* <a-plane color="#1a1a2e" width="3.2" height="0.6" position="0 2.5 -3" emissive="#1a1a2e"></a-plane>
                <a-text value={exhibit.title} align="center" anchor="center" position="0 2.5 -2.9"
                    color="#00d4ff" font-size="28" width="12" font-weight="bold"></a-text>
                <a-plane color="#00d4ff" width="3.2" height="0.08" position="0 2.08 -2.9" emissive="#00d4ff"></a-plane> */}

                {/* FOTOS - PAREDE ESQUERDA */}
                {/* Painel 1 */}
                <a-box
                    class="clickable"
                    color="#1a1a2e"
                    width="2.8"
                    height="2.3"
                    depth="0.08"
                    position="-6.8 2.3 -3"
                    rotation="0 15 0"
                    shadow
                ></a-box>
                <a-text value="HISTORIA" position="-6.8 0.9 -3" align="center" color="#00d4ff" font-size="20" width="7" font-weight="bold"></a-text>

                {/* Painel 2 */}
                <a-box
                    class="clickable"
                    color="#1a1a2e"
                    width="2.8"
                    height="2.3"
                    depth="0.08"
                    position="-6.8 2.3 3"
                    rotation="0 15 0"
                    shadow
                ></a-box>
                <a-text value=" TECNOLOGIA" position="-6.8 0.9 3" align="center" color="#00d4ff" font-size="20" width="7" font-weight="bold"></a-text>

                {/* FOTOS - PAREDE DIREITA */}
                {/* Painel 3 */}
                <a-box
                    class="clickable"
                    color="#1a1a2e"
                    width="2.8"
                    height="2.3"
                    depth="0.08"
                    position="6.8 2.3 -3"
                    rotation="0 -15 0"
                    shadow
                ></a-box>
                <a-text value="MISSOES" position="6.8 0.9 -3" align="center" color="#00d4ff" font-size="20" width="7" font-weight="bold"></a-text>

                {/* Painel 4 */}
                <a-box
                    class="clickable"
                    color="#1a1a2e"
                    width="2.8"
                    height="2.3"
                    depth="0.08"
                    position="6.8 2.3 3"
                    rotation="0 -15 0"
                    shadow
                ></a-box>
                <a-text value="✨ FUTURO" position="6.8 0.9 3" align="center" color="#00d4ff" font-size="20" width="7" font-weight="bold"></a-text>

                {/* TÍTULO E DESCRIÇÃO */}
                <a-text value={exhibit.title} align="center" anchor="center" position="0 3 -7.8"
                    color="#00d4ff" font-size="48" width="20" font-weight="bold"></a-text>
                {/* <a-text value="Explore a História da Conquista Espacial" align="center" anchor="center" position="0 2.8 -7.8"
                    color="#64b5f6" font-size="28" width="18"></a-text> */}

                {/* COLUNAS - Estilo Futurista */}
                <a-cylinder color="#00d4ff" radius="0.15" height="3.5" position="-7.5 1.75 -7.5" shadow emissive="#00d4ff"></a-cylinder>
                <a-cylinder color="#00d4ff" radius="0.15" height="3.5" position="7.5 1.75 -7.5" shadow emissive="#00d4ff"></a-cylinder>
                <a-box color="#00d4ff" width="16" height="0.04" depth="0.04" position="0 2.5 -7.95" shadow emissive="#00d4ff"></a-box>

                {/* Botão Voltar */}
                <a-box
                    class="clickable"
                    color="#00d4ff"
                    width="2"
                    height="0.4"
                    depth="0.1"
                    position="0 0.5 6.5"
                    emissive="#00d4ff"
                    shadow
                    data-action="voltar"
                ></a-box>
                <a-text value="VOLTAR" position="0 0.5 6.61" align="center" anchor="center" color="#0a0e27" font-size="18" width="10" font-weight="bold"></a-text>
            </a-scene>

            {/* PAINEL DE INFORMAÇÕES */}
            {activeInfo && (
                <div style={styles.infoPanel}>
                    <button style={styles.closeBtn} onClick={() => setActiveInfo(null)}>×</button>
                    <h3 style={styles.title}>{activeInfo.title}</h3>
                    <p style={styles.desc}>{activeInfo.desc}</p>
                    <button style={styles.actionBtn}>Saber Mais</button>
                </div>
            )}
        </div>
    );
}

const styles = {
    infoPanel: {
        position: 'absolute',
        top: '50%',
        right: '30px',
        transform: 'translateY(-50%)',
        background: '#0a0e27',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 212, 255, 0.5)',
        maxWidth: '320px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
        border: '2px solid #00d4ff'
    },
    title: {
        margin: '0 0 10px 0',
        color: '#00d4ff',
        fontSize: '20px'
    },
    desc: {
        margin: '0 0 15px 0',
        color: '#b0e0ff',
        lineHeight: '1.5',
        fontSize: '14px'
    },
    closeBtn: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: '#00d4ff',
        color: '#0a0e27',
        border: 'none',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold'
    },
    actionBtn: {
        width: '100%',
        padding: '10px 16px',
        background: '#00d4ff',
        color: '#0a0e27',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    }
};
const CENAS = {
    1: 'index-simples01.html',
    2: 'index-simples02.html'
};

function irParaCena(numeroCena) {
    if (CENAS[numeroCena]) {
        // Aplica o fade out
        document.body.style.opacity = '0';

        setTimeout(() => {
            // Usa location.assign ou href para permitir que o botão "voltar" funcione
            globalThis.location.href = CENAS[numeroCena];
        }, 500);
    }
}

// Quando a página terminar de carregar, faz o Fade In
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Hover para quando o cursor passar sobre os modelos 3D
AFRAME.registerComponent('cursor-hover', {
    schema: {
        cursorColor: { type: 'string', default: 'green' },
        originalColor: { type: 'string', default: 'black' }
    },
    init: function () {
        const cursor = document.querySelector('a-cursor');
        const hoverColor = this.data.cursorColor;

        this.el.addEventListener('mouseenter', () => {
            cursor.setAttribute('color', hoverColor);
            cursor.setAttribute('radiusInner', '0.005');
            cursor.setAttribute('radiusOuter', '0.015');
        });

        this.el.addEventListener('mouseleave', () => {
            cursor.setAttribute('color', this.data.originalColor);
            cursor.setAttribute('radiusInner', '0.003');
            cursor.setAttribute('radiusOuter', '0.01');
        });
    }

});



AFRAME.registerComponent('wall-collision', {
    schema: {
        radius: { type: 'number', default: 0.5 } // Raio de colisão do jogador
    },

    init() {
        this.walls = [];
        this.wallsLoaded = false;
    },

    tick() {
        const player = this.el;
        const playerPos = player.object3D.position;
        const radius = this.data.radius;

        // Carrega as paredes uma vez
        if (!this.wallsLoaded) {
            const wallElements = document.querySelectorAll('.wall');
            if (wallElements.length === 0) return;

            wallElements.forEach(wallEl => {
                const geometry = wallEl.getAttribute('geometry') || {};
                const width = wallEl.getAttribute('width') || geometry.width || 1;
                const height = wallEl.getAttribute('height') || geometry.height || 1;
                const depth = wallEl.getAttribute('depth') || geometry.depth || 1;

                this.walls.push({
                    el: wallEl,
                    width: parseFloat(width),
                    height: parseFloat(height),
                    depth: parseFloat(depth)
                });
            });
            this.wallsLoaded = true;
        }

        // Verifica colisão com cada parede
        this.walls.forEach(wall => {
            const wallPos = wall.el.object3D.position;
            const wallRot = wall.el.object3D.rotation;

            // Bounding box da parede (simplificado - assume sem rotação complexa)
            const halfWidth = wall.width / 2;
            const halfDepth = wall.depth / 2;

            // Calcula distância em X e Z
            const dx = Math.abs(playerPos.x - wallPos.x);
            const dz = Math.abs(playerPos.z - wallPos.z);

            // Verifica se há colisão (AABB simples)
            if (dx < (halfWidth + radius) && dz < (halfDepth + radius)) {
                // Calcula quanto o jogador está penetrando na parede
                const overlapX = (halfWidth + radius) - dx;
                const overlapZ = (halfDepth + radius) - dz;

                // Empurra o jogador na direção de menor overlap
                if (overlapX < overlapZ) {
                    // Empurra em X
                    if (playerPos.x < wallPos.x) {
                        playerPos.x -= overlapX;
                    } else {
                        playerPos.x += overlapX;
                    }
                } else {
                    // Empurra em Z
                    if (playerPos.z < wallPos.z) {
                        playerPos.z -= overlapZ;
                    } else {
                        playerPos.z += overlapZ;
                    }
                }
            }
        });
    }
});

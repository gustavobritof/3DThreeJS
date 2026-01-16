const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let points = [];
let start = Date.now();

const POINT_RADIUS = 2;
const FLOAT_AMPL = 7;
const LINK_DIST = 70;

async function loadSVG(path) {
    const res = await fetch(path);
    const text = await res.text();
    points = extractPoints(text);
}

function extractPoints(svgText) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const paths = doc.querySelectorAll("path");

    let pts = [];
    paths.forEach(p => {
        const len = p.getTotalLength();
        for (let i = 0; i < len; i += 55) {
            const pt = p.getPointAtLength(i);
            pts.push({ x: pt.x, y: pt.y });
        }
    });

    return scalePoints(pts);
}

function scalePoints(points) {
    if (points.length === 0) return points;

    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));

    const svgWidth = maxX - minX;
    const svgHeight = maxY - minY;

    const maxSize = Math.min(canvas.width, canvas.height) * 0.4;
    const scale = maxSize / Math.max(svgWidth, svgHeight);

    const offsetX = (canvas.width - svgWidth * scale) / 2;
    const offsetY = (canvas.height - svgHeight * scale) / 2;

    return points.map(p => ({
        x: (p.x - minX) * scale + offsetX,
        y: (p.y - minY) * scale + offsetY
    }));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = (Date.now() - start) * 0.001;

    for (let i = 0; i < points.length; i++) {
        const p = points[i];

        const ox = Math.sin(t + p.x * 0.01) * FLOAT_AMPL;
        const oy = Math.cos(t + p.y * 0.01) * FLOAT_AMPL;

        ctx.fillStyle = "rgba(180,220,255,0.9)";
        ctx.beginPath();
        ctx.arc(p.x + ox, p.y + oy, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
            const q = points[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < LINK_DIST) {
                ctx.strokeStyle = `rgba(120,180,255,${1 - d / LINK_DIST})`;
                ctx.beginPath();
                ctx.moveTo(p.x + ox, p.y + oy);
                ctx.lineTo(q.x, q.y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(draw);
}

loadSVG("assets/earth-12-svgrepo-com.svg").then(draw);

document.getElementById("enter").onclick = () => {
    window.location.href = "scene01.html";
};

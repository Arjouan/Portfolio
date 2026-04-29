const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((el) => observer.observe(el));

function initEarthGlobe() {
  const canvas = document.getElementById("earthGlobe");
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let rotation = 0;
  let frameHandle = 0;
  const autoRotateSpeed = 0.0018;
  const dragSensitivity = 0.008;
  const tiltSensitivity = 0.004;
  const maxTilt = (75 * Math.PI) / 180;
  let isDragging = false;
  let activePointerId = null;
  let lastPointerX = 0;
  let lastPointerY = 0;

  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";

  let centerLat = (15 * Math.PI) / 180;

  const countries = [
    { name: "Singapore", lat: 1.3521, lon: 103.8198 },
    { name: "Vietnam", lat: 14.0583, lon: 108.2772 },
    { name: "Australia", lat: -35.2809, lon: 149.13 },
    { name: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Canada", lat: 45.4215, lon: -75.6972 },
  ];

  let worldFeatures = [];

  const fallbackContinents = [
    [
      [71, -156], [64, -110], [53, -95], [49, -125], [31, -117], [23, -103], [9, -86],
      [20, -74], [36, -83], [47, -67], [57, -63], [67, -90],
    ],
    [
      [59, -10], [56, 8], [52, 22], [48, 36], [43, 44], [41, 30], [38, 14], [45, 2],
    ],
    [
      [37, -17], [32, 4], [19, 17], [5, 10], [-14, 16], [-35, 18], [-27, 32], [5, 39],
      [20, 45], [33, 34],
    ],
    [
      [70, 40], [59, 78], [50, 116], [44, 141], [30, 120], [15, 105], [7, 77], [24, 58],
      [39, 55], [50, 62], [58, 52],
    ],
    [
      [-11, 114], [-24, 113], [-34, 132], [-28, 152], [-18, 147],
    ],
  ];

  function project(latDeg, lonDeg, radius) {
    const lat = (latDeg * Math.PI) / 180;
    const lon = (lonDeg * Math.PI) / 180;
    const deltaLon = lon - rotation;
    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);
    const cosDeltaLon = Math.cos(deltaLon);
    const sinCenterLat = Math.sin(centerLat);
    const cosCenterLat = Math.cos(centerLat);
    const visibility = sinCenterLat * sinLat + cosCenterLat * cosLat * cosDeltaLon;

    if (visibility <= 0) {
      return null;
    }

    return {
      x: radius * cosLat * Math.sin(deltaLon),
      y: -radius * (cosCenterLat * sinLat - sinCenterLat * cosLat * cosDeltaLon),
      visibility,
    };
  }

  function drawGraticule(radius) {
    ctx.strokeStyle = "rgba(239, 247, 255, 0.14)";
    ctx.lineWidth = 1;

    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = project(lat, lon, radius);
        if (!p) {
          started = false;
          continue;
        }
        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    for (let lon = -150; lon <= 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -85; lat <= 85; lat += 3) {
        const p = project(lat, lon, radius);
        if (!p) {
          started = false;
          continue;
        }
        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }
  }

  function drawVisibleRingPath(ring, radius) {
    let hasStroke = false;
    let segmentOpen = false;

    ring.forEach(([lon, lat]) => {
      const p = project(lat, lon, radius);
      if (!p || p.visibility <= 0) {
        segmentOpen = false;
        return;
      }

      const px = canvas.width / 2 + p.x;
      const py = canvas.height / 2 + p.y;
      if (!segmentOpen) {
        ctx.moveTo(px, py);
        segmentOpen = true;
        hasStroke = true;
      } else {
        ctx.lineTo(px, py);
      }
    });

    return hasStroke;
  }

  function drawRealCountryOutlines(radius) {
    if (!worldFeatures.length) {
      return false;
    }

    ctx.strokeStyle = "rgba(98, 208, 149, 0.9)";
    ctx.lineWidth = Math.max(0.8, canvas.width * 0.0028);

    worldFeatures.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry) {
        return;
      }

      if (geometry.type === "Polygon") {
        ctx.beginPath();
        let hasPath = false;
        geometry.coordinates.forEach((ring) => {
          if (drawVisibleRingPath(ring, radius)) {
            hasPath = true;
          }
        });
        if (hasPath) {
          ctx.stroke();
        }
        return;
      }

      if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          ctx.beginPath();
          let hasPath = false;
          polygon.forEach((ring) => {
            if (drawVisibleRingPath(ring, radius)) {
              hasPath = true;
            }
          });
          if (hasPath) {
            ctx.stroke();
          }
        });
      }
    });

    return true;
  }

  function drawFallbackContinents(radius) {
    ctx.fillStyle = "rgba(42, 139, 99, 0.82)";
    ctx.strokeStyle = "rgba(172, 234, 204, 0.3)";
    ctx.lineWidth = 1;

    fallbackContinents.forEach((shape) => {
      ctx.beginPath();
      let started = false;
      shape.forEach(([lat, lon]) => {
        const p = project(lat, lon, radius);
        if (!p) {
          return;
        }

        const px = canvas.width / 2 + p.x;
        const py = canvas.height / 2 + p.y;
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      });

      if (started) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    });
  }

  async function loadWorldGeometry() {
    try {
      const response = await fetch("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson");
      if (!response.ok) {
        throw new Error(`Failed to load world geometry: ${response.status}`);
      }

      const data = await response.json();
      if (data && Array.isArray(data.features)) {
        worldFeatures = data.features;
        drawGlobe();
      }
    } catch (error) {
      // Keep fallback continent rendering if remote GeoJSON is unavailable.
      console.warn("World geometry unavailable, using fallback land shapes.", error);
    }
  }

  function drawCountryDots(radius) {
    countries.forEach((country) => {
      const p = project(country.lat, country.lon, radius);
      if (!p) {
        return;
      }

      const px = canvas.width / 2 + p.x;
      const py = canvas.height / 2 + p.y;

      ctx.beginPath();
      ctx.fillStyle = "rgba(253, 224, 71, 0.98)";
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(253, 224, 71, 0.45)";
      ctx.lineWidth = 2;
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.stroke();

      const labelOffset = p.x >= 0 ? 10 : -10;
      const labelX = px + labelOffset;
      const labelY = py - 10;

      ctx.font = `${Math.max(10, canvas.width * 0.028)}px "Sora", sans-serif`;
      ctx.textAlign = p.x >= 0 ? "left" : "right";
      ctx.textBaseline = "middle";

      const textWidth = ctx.measureText(country.name).width;
      const paddingX = 5;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = Math.max(14, canvas.width * 0.04);
      const boxLeft = p.x >= 0 ? labelX - paddingX : labelX - boxWidth + paddingX;
      const boxTop = labelY - boxHeight / 2;

      ctx.fillStyle = "rgba(6, 20, 33, 0.75)";
      ctx.fillRect(boxLeft, boxTop, boxWidth, boxHeight);

      ctx.fillStyle = "rgba(239, 247, 255, 0.95)";
      ctx.fillText(country.name, labelX, labelY);
    });
  }

  function drawGlobe() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height);
    const target = Math.max(1, Math.floor(size * dpr));

    if (canvas.width !== target || canvas.height !== target) {
      canvas.width = target;
      canvas.height = target;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = canvas.width * 0.46;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const oceanGradient = ctx.createRadialGradient(
      cx - radius * 0.35,
      cy - radius * 0.4,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    oceanGradient.addColorStop(0, "#5ec4ff");
    oceanGradient.addColorStop(0.5, "#1178b6");
    oceanGradient.addColorStop(1, "#0a2f4d");

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGradient;
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    drawGraticule(radius);
    const hasRealOutlines = drawRealCountryOutlines(radius);
    if (!hasRealOutlines) {
      drawFallbackContinents(radius);
    }
    drawCountryDots(radius);

    const shadeGradient = ctx.createRadialGradient(
      cx + radius * 0.55,
      cy - radius * 0.2,
      radius * 0.25,
      cx,
      cy,
      radius * 1.2
    );
    shadeGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    shadeGradient.addColorStop(1, "rgba(0, 0, 0, 0.44)");
    ctx.fillStyle = shadeGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(239, 247, 255, 0.34)";
    ctx.lineWidth = Math.max(1, canvas.width * 0.006);
    ctx.stroke();
  }

  function animate() {
    drawGlobe();

    if (!prefersReducedMotion) {
      if (!isDragging) {
        rotation += autoRotateSpeed;
      }
      frameHandle = window.requestAnimationFrame(animate);
    }
  }

  function onPointerDown(event) {
    isDragging = true;
    activePointerId = event.pointerId;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event) {
    if (!isDragging || event.pointerId !== activePointerId) {
      return;
    }

    const deltaX = event.clientX - lastPointerX;
    const deltaY = event.clientY - lastPointerY;
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;
    rotation -= deltaX * dragSensitivity;
    centerLat += deltaY * tiltSensitivity;
    centerLat = Math.max(-maxTilt, Math.min(maxTilt, centerLat));

    if (prefersReducedMotion) {
      drawGlobe();
    }
  }

  function endPointerDrag(event) {
    if (event.pointerId !== activePointerId) {
      return;
    }

    isDragging = false;
    activePointerId = null;
    canvas.style.cursor = "grab";
    canvas.releasePointerCapture(event.pointerId);
  }

  animate();
  loadWorldGeometry();

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endPointerDrag);
  canvas.addEventListener("pointercancel", endPointerDrag);

  window.addEventListener("resize", drawGlobe);
  window.addEventListener("pagehide", () => {
    if (frameHandle) {
      window.cancelAnimationFrame(frameHandle);
    }

    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", endPointerDrag);
    canvas.removeEventListener("pointercancel", endPointerDrag);
  });
}

initEarthGlobe();

// Sample assets and re-encoding utilities for the live demo. Everything
// runs client-side so the "register -> compress -> still matches" claim can
// be proven on stage without a backend.

function drawSample(ctx: CanvasRenderingContext2D, seed: number) {
  const w = 600;
  const h = 600;
  ctx.fillStyle = "#0e0c08";
  ctx.fillRect(0, 0, w, h);

  const glow = ctx.createRadialGradient(180 + seed * 30, 150, 10, 180 + seed * 30, 150, 240);
  glow.addColorStop(0, "rgba(230,195,79,0.85)");
  glow.addColorStop(1, "rgba(201,162,39,0.12)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(180 + seed * 30, 150, 200, 0, Math.PI * 2);
  ctx.fill();

  const orb = ctx.createRadialGradient(420, 380, 10, 420, 380, 150);
  orb.addColorStop(0, "rgba(230,195,79,0.5)");
  orb.addColorStop(1, "rgba(201,162,39,0.05)");
  ctx.fillStyle = orb;
  ctx.beginPath();
  ctx.arc(420, 380, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(230,195,79,0.55)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    ctx.beginPath();
    ctx.arc(300, 300, 60 + i * 20, 0.3 + i * 0.35, 4.9 + i * 0.25);
    ctx.stroke();
  }

  for (let i = 0; i < 36; i++) {
    ctx.fillStyle = `rgba(${170 + ((seed * i) % 70)},${140 + ((seed * i) % 80)},60,0.45)`;
    const s = 10 + ((seed + i * 7) % 28);
    ctx.fillRect(((seed * i * 97) % 600), ((seed * i * 53) % 600), s, s);
  }
}

export async function makeSampleFile(seed = 7): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable.");
  drawSample(ctx, seed);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not render the sample."))), "image/jpeg", 0.92),
  );
  return new File([blob], `sample-${seed}.jpg`, { type: "image/jpeg" });
}

export async function compressCopy(file: File): Promise<File> {
  let source: ImageBitmap | HTMLImageElement;
  let url: string | null = null;
  if (typeof createImageBitmap === "function") {
    source = await createImageBitmap(file);
  } else {
    url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not read the image."));
    });
    source = img;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width / 2));
  canvas.height = Math.max(1, Math.round(source.height / 2));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    if (url) URL.revokeObjectURL(url);
    throw new Error("Canvas is unavailable.");
  }
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if (url) URL.revokeObjectURL(url);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not re-encode the copy."))), "image/jpeg", 0.5),
  );
  return new File([blob], "re-encoded.jpg", { type: "image/jpeg" });
}
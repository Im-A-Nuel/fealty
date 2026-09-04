// Client-side difference hash (dHash, 64-bit). Used by the demo flow so
// register -> verify actually works in the browser while the Go backend is
// offline. The Go backend uses goimagehash pHash; the hex format is the same.

export async function computeDHash(file: File): Promise<string> {
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
  canvas.width = 9;
  canvas.height = 8;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    if (url) URL.revokeObjectURL(url);
    throw new Error("Canvas is unavailable.");
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, 9, 8);
  if (url) URL.revokeObjectURL(url);

  const { data } = ctx.getImageData(0, 0, 9, 8);
  const gray: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }

  let bits = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      bits += gray[r * 9 + c] >= gray[r * 9 + c + 1] ? "1" : "0";
    }
  }

  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    hex += parseInt(bits.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

export function hammingDistance(a: string, b: string): number {
  const diff = (BigInt(`0x${a}`) ^ BigInt(`0x${b}`)).toString(2);
  let n = 0;
  for (const ch of diff) {
    if (ch === "1") n++;
  }
  return n;
}

export async function makeThumbnail(file: File, size = 256): Promise<string> {
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
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const ratio = Math.min(size / source.width, size / source.height);
    const w = source.width * ratio;
    const h = source.height * ratio;
    ctx.fillStyle = "#0b0a08";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(source, (size - w) / 2, (size - h) / 2, w, h);
  }
  if (url) URL.revokeObjectURL(url);

  try {
    return canvas.toDataURL("image/webp", 0.8);
  } catch {
    return canvas.toDataURL("image/jpeg", 0.8);
  }
}
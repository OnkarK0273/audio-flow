export function createPCMBlob(data: Float32Array) {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const element = Math.max(-1, Math.min(1, data[i]));
    int16[i] = element < 0 ? element * 32768 : element * 32767;
  }

  return {
    data: arrayBufferToBase64(int16),
    mimeType: "audio/pcm;rate=16000",
  };
}

export function calculateAudioLevel(data: Float32Array): number {
  if (!data || data.length === 0) return 0;
  let sumSquares = 0;
  for (let i = 0; i < data.length; i++) {
    sumSquares += data[i] * data[i];
  }
  const rms = Math.sqrt(sumSquares / data.length);
  // Logarithmic-like scaling for responsive visual feedback (0 to 100)
  const normalized = Math.min(100, Math.round(rms * 400));
  return normalized;
}

function arrayBufferToBase64(data: Int16Array): string {
  const bytes = new Uint8Array(data.buffer);
  let str = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str);
}

export function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Converts raw 16-bit linear PCM byte buffer into a standard RIFF/WAVE Blob
 * playable natively by all browsers and media players.
 */
export function createWavBlobFromPcm(
  pcmData: Uint8Array,
  sampleRate = 24000,
  numChannels = 1,
  bitsPerSample = 16,
): Blob {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(view, 8, "WAVE");

  // "fmt " sub-chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // 16 for PCM
  view.setUint16(20, 1, true); // Linear quantization (PCM = 1)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // "data" sub-chunk
  writeString(view, 36, "data");
  view.setUint32(40, pcmData.length, true);

  // Copy PCM data
  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  return new Blob([buffer], { type: "audio/wav" });
}

export function base64PcmToWavBlob(
  base64: string,
  sampleRate = 24000,
  numChannels = 1,
): Blob {
  const pcmBytes = base64ToUint8Array(base64);
  return createWavBlobFromPcm(pcmBytes, sampleRate, numChannels);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

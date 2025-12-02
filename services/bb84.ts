import { Basis, Qubit, SimulationConfig, SimulationResult } from '../types';

// Helper to generate random bit (0 or 1)
const randomBit = (): number => Math.random() < 0.5 ? 0 : 1;

// Helper to choose random basis
const randomBasis = (): Basis => Math.random() < 0.5 ? Basis.Rectilinear : Basis.Diagonal;

// Helper to determine state symbol
const getStateSymbol = (bit: number, basis: Basis): string => {
  if (basis === Basis.Rectilinear) {
    return bit === 0 ? '↑' : '→';
  } else {
    return bit === 0 ? '↗' : '↘';
  }
};

// Simulate measurement
// If measuring in same basis: result is deterministic (original bit).
// If measuring in different basis: result is random (50/50).
const measureQubit = (originalBit: number, originalBasis: Basis, measurementBasis: Basis): number => {
  if (originalBasis === measurementBasis) {
    return originalBit;
  }
  return randomBit();
};

export const runBB84Simulation = (config: SimulationConfig): SimulationResult => {
  const qubits: Qubit[] = [];
  const { numQubits, eveInterceptRate, sampleRate } = config;

  for (let i = 0; i < numQubits; i++) {
    // 1. Alice Preparation
    const aliceBit = randomBit();
    const aliceBasis = randomBasis();
    const sentState = getStateSymbol(aliceBit, aliceBasis);

    // 2. Transmission (Eve's Interference)
    let currentBit = aliceBit;
    let currentBasis = aliceBasis;
    let eveIntercepted = false;
    let eveBasis: Basis | undefined = undefined;
    let eveMeasuredBit: number | undefined = undefined;

    if (Math.random() < eveInterceptRate) {
      eveIntercepted = true;
      eveBasis = randomBasis();
      // Eve measures the qubit
      eveMeasuredBit = measureQubit(currentBit, currentBasis, eveBasis);
      // Eve resends based on her measurement
      currentBit = eveMeasuredBit;
      currentBasis = eveBasis;
    }

    // 3. Bob Reception
    const bobBasis = randomBasis();
    const bobMeasuredBit = measureQubit(currentBit, currentBasis, bobBasis);

    // 4. Sifting (Basis Matching)
    // We only keep bits where Alice and Bob used the same basis.
    // Note: If Eve changed the state (wrong basis), Bob might still measure correctly by chance (50%),
    // or incorrectly (50%). QBER detects this.
    const basisMatch = aliceBasis === bobBasis;

    qubits.push({
      id: i,
      aliceBit,
      aliceBasis,
      sentState,
      eveIntercepted,
      eveBasis,
      eveMeasuredBit,
      bobBasis,
      bobMeasuredBit,
      basisMatch,
      sampleForQBER: false // Determined later
    });
  }

  // Filter for Sifted Key
  const siftedIndices = qubits.filter(q => q.basisMatch).map(q => q.id);
  const siftedKeyLength = siftedIndices.length;

  // 5. Parameter Estimation (Calculate QBER)
  // We reveal a subset of the sifted key to check for errors.
  const sampleSize = Math.floor(siftedKeyLength * sampleRate);
  
  // Randomly select indices for sampling
  const sampleIndices = new Set<number>();
  while (sampleIndices.size < sampleSize && sampleIndices.size < siftedKeyLength) {
    const randomIndex = Math.floor(Math.random() * siftedKeyLength);
    sampleIndices.add(siftedIndices[randomIndex]);
  }

  let errorsFound = 0;
  let finalKeyBits: number[] = [];

  qubits.forEach(q => {
    if (q.basisMatch) {
      if (sampleIndices.has(q.id)) {
        q.sampleForQBER = true;
        if (q.aliceBit !== q.bobMeasuredBit) {
          errorsFound++;
        }
      } else {
        // These bits form the raw final key (before error correction/privacy amplification)
        finalKeyBits.push(q.bobMeasuredBit);
      }
    }
  });

  const qber = sampleSize > 0 ? errorsFound / sampleSize : 0;
  
  // Security Threshold (typically ~11% for BB84)
  const isSecure = qber < 0.11;
  let securityMessage = isSecure 
    ? "QBER ต่ำกว่าเกณฑ์ (11%). ช่องสัญญาณปลอดภัย (Secure)." 
    : "QBER สูงเกินไป! อาจมีการดักฟัง (Eavesdropping Detected). ยกเลิกคีย์";

  if (siftedKeyLength === 0) {
    securityMessage = "ไม่พบคีย์ที่ตรงกัน (No Sifted Key).";
  }

  // Simple formatting for final key (mock Privacy Amplification to Hex)
  const binaryString = finalKeyBits.join('');
  let finalKeyHex = '';
  // Convert binary to hex in chunks of 4
  for (let i = 0; i < binaryString.length; i += 4) {
    const chunk = binaryString.substring(i, i + 4);
    if (chunk.length === 4) {
      finalKeyHex += parseInt(chunk, 2).toString(16);
    }
  }

  return {
    qubits,
    rawKeyLength: numQubits,
    siftedKeyLength,
    sampleSize,
    errorsFound,
    qber,
    finalKey: isSecure ? finalKeyHex.toUpperCase() : "ABORTED",
    isSecure,
    securityMessage
  };
};

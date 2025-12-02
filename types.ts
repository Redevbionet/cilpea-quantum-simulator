export enum Basis {
  Rectilinear = '+', // 0 deg / 90 deg
  Diagonal = 'X',    // 45 deg / 135 deg
}

export interface Qubit {
  id: number;
  aliceBit: number;
  aliceBasis: Basis;
  sentState: string; // e.g., |↑>, |→>, |↗>, |↘>
  eveIntercepted: boolean;
  eveBasis?: Basis;
  eveMeasuredBit?: number;
  bobBasis: Basis;
  bobMeasuredBit: number;
  basisMatch: boolean; // Part of sifted key?
  sampleForQBER: boolean; // Used for parameter estimation?
}

export interface SimulationResult {
  qubits: Qubit[];
  rawKeyLength: number;
  siftedKeyLength: number;
  sampleSize: number;
  errorsFound: number;
  qber: number; // Quantum Bit Error Rate
  finalKey: string; // Hex or binary string representation
  isSecure: boolean;
  securityMessage: string;
}

export interface SimulationConfig {
  numQubits: number;
  eveInterceptRate: number; // 0.0 to 1.0
  sampleRate: number; // Percentage of sifted key to use for QBER estimation
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

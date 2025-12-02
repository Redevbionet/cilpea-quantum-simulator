import { GoogleGenAI } from "@google/genai";
import { SimulationResult } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found via process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSimulation = async (result: SimulationResult, userPrompt?: string) => {
  try {
    const client = getClient();
    
    const context = `
      คุณคือผู้เชี่ยวชาญด้านควอนตัมฟิสิกส์และการเข้ารหัส (Quantum Cryptography) ในระบบ CilPea
      
      บริบทปัจจุบัน: การจำลอง BB84 Protocol
      - จำนวน Qubits ทั้งหมด: ${result.rawKeyLength}
      - ความยาว Sifted Key: ${result.siftedKeyLength}
      - QBER (Error Rate): ${(result.qber * 100).toFixed(2)}%
      - สถานะความปลอดภัย: ${result.isSecure ? "ปลอดภัย (Secure)" : "ไม่ปลอดภัย (Unsecure)"}
      - ข้อความระบบ: ${result.securityMessage}
      
      คำถามจากผู้ใช้: "${userPrompt || "ช่วยวิเคราะห์ผลลัพธ์นี้ และอธิบายความสัมพันธ์กับการจำลองโมเลกุล (Molecular Simulation) หากใช้ควอนตัมคอมพิวเตอร์จริง"}"
      
      ตอบเป็นภาษาไทย ให้ความรู้เชิงลึกแต่น่าอ่าน สั้นกระชับ (ไม่เกิน 300 คำ)
      ถ้า QBER สูง ให้อธิบายว่า Eve อาจทำอะไรลงไป
      ถ้าผู้ใช้ถามเรื่องโมเลกุล ให้เชื่อมโยงว่าคอมพิวเตอร์ควอนตัมใช้หลักการ Superposition/Entanglement แบบเดียวกับใน BB84 เพื่อจำลองโครงสร้างโมเลกุลที่ซับซ้อนได้อย่างไร
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ขออภัย ไม่สามารถเชื่อมต่อกับ AI Assistant ได้ในขณะนี้ (ตรวจสอบ API Key)";
  }
};

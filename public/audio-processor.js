class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (input.length > 0) {
      const inputData = input[0];
      
      // Convert Float32 → Int16 PCM
      const buffer = new ArrayBuffer(inputData.length * 2);
      const view = new DataView(buffer);
      
      for (let i = 0; i < inputData.length; i++) {
        let s = Math.max(-1, Math.min(1, inputData[i]));
        view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
      
      // Send audio data to main thread
      this.port.postMessage(new Uint8Array(buffer));
    }
    
    return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);

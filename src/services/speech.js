const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class BrowserSpeechRecognizer {
  constructor({ interim = true, lang = 'en-US' } = {}) {
    this.supported = Boolean(SpeechRecognition);
    this.lang = lang;
    this.interimResults = interim;
    this.recognition = null;
  }

  start(onResult, onEnd, onError) {
    if (!this.supported) {
      onError?.(new Error('Web Speech API not supported'));
      return () => {};
    }
    const rec = new SpeechRecognition();
    rec.lang = this.lang;
    rec.interimResults = this.interimResults;
    rec.continuous = true;

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      const isFinal = event.results[event.results.length - 1].isFinal;
      onResult?.({ transcript, isFinal });
    };
    rec.onerror = (e) => onError?.(e.error || e);
    rec.onend = () => onEnd?.();

    rec.start();
    this.recognition = rec;
    return () => {
      try { rec.stop(); } catch {}
    };
  }
}

// Placeholder for Gemini Live client. For MVP we use browser speech,
// later swap to Gemini streaming for improved accuracy and NLP.
export class GeminiLiveClient {
  constructor({ apiKey, model = 'gemini-2.5-flash' } = {}) {
    this.apiKey = apiKey;
    this.model = model;
  }

  // In a production setup, implement streaming transcription via Gemini Live API.
  start() {
    throw new Error('Gemini Live streaming not implemented in MVP');
  }
}

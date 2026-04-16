/* ═══════════════════════════════════════════════════════════════
   DRISHTI NEXUS v3 — Voice Engine
   Web Speech API for voice input + TTS output
   Supports English, Hindi (हिन्दी), and Marathi (मराठी)
   ═══════════════════════════════════════════════════════════════ */

export class VoiceEngine {
  constructor() {
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.transcript = '';
    this.currentLang = 'en-IN';
    this.onResult = null;
    this.onEnd = null;
    this.onError = null;
    this.supported = this._checkSupport();
    this._initRecognition();
  }

  _checkSupport() {
    return {
      speechRecognition: !!(window.SpeechRecognition || window.webkitSpeechRecognition),
      speechSynthesis: !!window.speechSynthesis,
    };
  }

  _initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = this.currentLang;

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      this.transcript = finalTranscript || interimTranscript;
      if (this.onResult) this.onResult(this.transcript, !!finalTranscript);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd(this.transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) this.onError(event.error);
    };
  }

  /* Set recognition and TTS language */
  setLanguage(langCode) {
    this.currentLang = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  /* Start listening */
  startListening() {
    if (!this.recognition) {
      if (this.onError) this.onError('Speech recognition not supported');
      return false;
    }
    try {
      // Re-set language before starting
      this.recognition.lang = this.currentLang;
      this.transcript = '';
      this.isListening = true;
      this.recognition.start();
      return true;
    } catch (e) {
      this.isListening = false;
      if (this.onError) this.onError(e.message);
      return false;
    }
  }

  /* Stop listening */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /* Speak text using TTS — supports en-IN, hi-IN, mr-IN */
  speak(text, options = {}) {
    if (!this.synthesis) return false;

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const lang = options.lang || this.currentLang;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = options.rate || (lang === 'en-IN' ? 1.0 : 0.9);
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 0.9;

    // Try to find appropriate voice for the language
    const voices = this.synthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === lang) ||
                          voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
                          voices.find(v => v.lang.startsWith('en'));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onstart = () => { this.isSpeaking = true; };
    utterance.onend = () => { this.isSpeaking = false; };
    utterance.onerror = () => { this.isSpeaking = false; };

    this.synthesis.speak(utterance);
    return true;
  }

  /* Stop speaking */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  /* Get available voices for a language */
  getVoicesForLang(langCode) {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices().filter(v =>
      v.lang === langCode || v.lang.startsWith(langCode.split('-')[0])
    ).map(v => ({ name: v.name, lang: v.lang, isLocal: v.localService }));
  }

  /* Get engine status */
  getStatus() {
    return {
      supported: this.supported,
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      currentLang: this.currentLang,
      currentTranscript: this.transcript,
    };
  }
}

export const voiceEngine = new VoiceEngine();

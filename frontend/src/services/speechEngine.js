// AkiVoice AI — Robust Speech Recognition & Audio Capture Engine

export class SpeechEngine {
  constructor(onTranscriptUpdate, onStatusChange) {
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onStatusChange = onStatusChange;
    this.recognition = null;
    this.isListening = false;
    this.fullTranscript = '';
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioUrl = null;
    this.audioBlob = null;
    this.timerInterval = null;
    this.startTime = 0;
    this.elapsedSeconds = 0;

    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          this.fullTranscript = (this.fullTranscript + ' ' + final).trim();
        }

        const combined = (this.fullTranscript + ' ' + interim).trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(combined, interim);
        }
      };

      this.recognition.onerror = (event) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'no-speech') {
          // Keep alive unless user stopped
          if (this.isListening) {
            try { this.recognition.start(); } catch (e) {}
          }
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            // Already active or stopped
          }
        } else {
          if (this.onStatusChange) this.onStatusChange('idle');
        }
      };
    }
  }

  setLanguage(langCode) {
    if (this.recognition) {
      this.recognition.lang = langCode || 'en-US';
    }
  }

  async startListening() {
    if (this.isListening) return;

    this.isListening = true;
    this.elapsedSeconds = 0;
    this.startTime = Date.now();

    // Start timer
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
      if (this.onStatusChange) this.onStatusChange('recording', this.elapsedSeconds);
    }, 1000);

    // Start MediaRecorder if supported
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        if (this.audioUrl) URL.revokeObjectURL(this.audioUrl);
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        if (this.onStatusChange) this.onStatusChange('stopped', this.elapsedSeconds, this.audioUrl, this.audioBlob);
      };

      this.mediaRecorder.start(250);
    } catch (err) {
      console.warn('Microphone MediaRecorder access denied or unavailable:', err);
    }

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition start caught:', err);
      }
    }
    if (this.onStatusChange) this.onStatusChange('recording', 0);
  }

  stopListening() {
    this.isListening = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
        this.mediaRecorder.stream.getTracks().forEach(t => t.stop());
      } catch (e) {}
    } else {
      if (this.onStatusChange) this.onStatusChange('stopped', this.elapsedSeconds, this.audioUrl, this.audioBlob);
    }
  }

  reset() {
    this.stopListening();
    this.fullTranscript = '';
    this.elapsedSeconds = 0;
    this.audioChunks = [];
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }
    this.audioBlob = null;
  }
}

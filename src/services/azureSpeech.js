import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

class AzureSpeechService {
  constructor() {
    this.speechKey = import.meta.env.VITE_AZURE_SPEECH_KEY;
    this.speechRegion = import.meta.env.VITE_AZURE_SPEECH_REGION;
    this.synthesizer = null;
    this.isInitialized = false;
  }

  initialize() {
    if (!this.speechKey || this.speechKey === 'YOUR_AZURE_SPEECH_KEY_HERE') {
      console.warn('Azure Speech key niet geconfigureerd. Gebruik .env bestand.');
      return false;
    }

    try {
      const speechConfig = sdk.SpeechConfig.fromSubscription(
        this.speechKey,
        this.speechRegion
      );

      // Stel Nederlandse stem in - MaartenNeural voor mannelijke mysterieuze stem
      speechConfig.speechSynthesisVoiceName = 'nl-NL-MaartenNeural';
      
      // Audio output naar browser speakers
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      
      this.synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
      this.isInitialized = true;
      
      console.log('Azure Speech Service geïnitialiseerd');
      return true;
    } catch (error) {
      console.error('Fout bij initialiseren Azure Speech:', error);
      return false;
    }
  }

  async speak(text, options = {}) {
    if (!this.isInitialized) {
      if (!this.initialize()) {
        console.error('Azure Speech niet beschikbaar, gebruik fallback');
        return this.fallbackSpeak(text);
      }
    }

    // Bouw SSML voor meer controle over de stem
    const ssml = this.buildSSML(text, options);

    return new Promise((resolve, reject) => {
      this.synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log('Spraaksynthese voltooid');
            resolve(result);
          } else {
            console.error('Spraaksynthese mislukt:', result.errorDetails);
            // Fallback naar browser TTS
            this.fallbackSpeak(text);
            reject(result.errorDetails);
          }
        },
        (error) => {
          console.error('Fout bij spraaksynthese:', error);
          // Fallback naar browser TTS
          this.fallbackSpeak(text);
          reject(error);
        }
      );
    });
  }

  buildSSML(text, options = {}) {
    const {
      voice = 'nl-NL-MaartenNeural',
      style = 'whispering', // whispering, fearful, sad voor escape room sfeer
      rate = '0.9', // Iets langzamer voor spanning
      pitch = '-5%', // Iets lagere stem
      volume = '90'
    } = options;

    // SSML voor Azure met express-as voor emotie
    return `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
             xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="nl-NL">
        <voice name="${voice}">
          <mstts:express-as style="${style}" styledegree="2">
            <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">
              ${this.addPauses(text)}
            </prosody>
          </mstts:express-as>
        </voice>
      </speak>
    `;
  }

  addPauses(text) {
    // Voeg dramatische pauzes toe
    return text
      .replace(/\.\.\./g, '<break time="1500ms"/>')
      .replace(/\./g, '.<break time="500ms"/>')
      .replace(/\?/g, '?<break time="700ms"/>')
      .replace(/!/g, '!<break time="400ms"/>');
  }

  // Fallback naar browser TTS
  fallbackSpeak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL';
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }

  stop() {
    if (this.synthesizer) {
      // Stop huidige spraak
      this.synthesizer.close();
      this.isInitialized = false;
    }
    // Stop ook browser TTS als fallback
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
}

// Singleton instance
export const azureSpeech = new AzureSpeechService();
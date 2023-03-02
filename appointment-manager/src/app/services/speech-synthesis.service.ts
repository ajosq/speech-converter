import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpeechSynthesisService {

    private speechApi = (window as any).speechSynthesis;
    private voiceIndex = 4;

    constructor() { }

    public talk(text: string, callback?: () => void) {
        this.speechApi.cancel();
        const message = new SpeechSynthesisUtterance(text);
        message.voice = this.speechApi.getVoices()[this.voiceIndex];
        message.lang = message.voice?.lang as string;
        if (callback) {
            message.onend = callback;
        }
        this.speechApi.speak(message);
    }

}

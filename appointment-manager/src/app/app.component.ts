import { Component } from '@angular/core';
import { isNil } from 'lodash-es';
import { AskForMoreInfo } from './constants';

import { isQuestion } from './helper';
import { InputModelGeneratorService } from './services/input-model-generator.service';
import { SpeechSynthesisService } from './services/speech-synthesis.service';
import { SpeechToTextService } from './services/speech-to-text.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    public title = 'appointment-manager';
    public textArray: string[] = [];
    private continuousErrorCount = 0;
    private assistantName = 'Alexa';
    private introNeeded = true;

    constructor(
        private speechToText: SpeechToTextService,
        private modelGenerator: InputModelGeneratorService,
        private speechSynthesisService: SpeechSynthesisService
    ) { }

    public async start() {
        if (this.introNeeded) {
            await this.playIntro();
            this.introNeeded = false;
        }
        this.speechToText
            .listen()
            .then((output) => {
                if (isQuestion(output)) {
                    output = output + '?';
                }
                this.textArray.push(output);
                const { operation } = this.modelGenerator.getModelFromText(output);
                const { missingInput } = this.modelGenerator;
                if (!this.modelGenerator.noMissingItems && !isNil(missingInput)) {
                    const ask = AskForMoreInfo?.[operation]?.[missingInput];
                    this.speechSynthesisService.talk(ask);
                } else {
                    // Perform the api call here ...
                }
            })
            .catch(() => {
                this.continuousErrorCount++;
                let errorMessage = this.continuousErrorCount > 3 ?
                    "I apologize, but I'm having trouble coming up with a response to your query. Please try again at a later time." :
                    "Sorry, I didn't quite get you. Could your paraphrase it?";
                this.speechSynthesisService.talk(errorMessage);
            });
    }

    private playIntro(): Promise<void> {
        return new Promise((resolve) => {
            const message = `
               Greetings!, My name is ${this.assistantName}. I can help you organize your appointments.
               By pressing the microphone button and asking me questions, you can communicate with me.
               If there is anything else I can do for you today, please let me know.
               `;
            this.speechSynthesisService.talk(message, () => resolve());
        })

    }
}

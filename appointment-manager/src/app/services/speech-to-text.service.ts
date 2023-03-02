import { first, upperFirst } from 'lodash-es';
import { Observable, Subject } from 'rxjs';

import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SpeechToTextService {

    private _speechEvent = 'result';
    private _webkitSpeechRecognition: any;
    private _sprTimeout: any;

    private listeningComplete$ = new Subject<boolean>();
    private timeToComplete = 2000;
    private renderer2: Renderer2;

    public onListeningComplete: Observable<boolean>;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer2 = rendererFactory.createRenderer(null, null);
        const WebkitSpeechRecognition = (window as any).webkitSpeechRecognition;
        this.onListeningComplete = this.listeningComplete$.asObservable();
        this.speechRecognizer = new WebkitSpeechRecognition();
        this.speechRecognizer.lang = 'en-US';
        this.speechRecognizer.interimResults = true;
        this.speechRecognizer.continuous = true;
    }


    public get speechRecognizer(): any {
        return this._webkitSpeechRecognition;
    }

    public set speechRecognizer(v: any) {
        this._webkitSpeechRecognition = v;
    }

    public listen(): Promise<string> {
        return new Promise<string>((resolve) => {
            const listenerFn = this.renderer2.listen(this.speechRecognizer, this._speechEvent, (event) => {
                if (this._sprTimeout) {
                    clearTimeout(this._sprTimeout);
                }
                const output = (Array.from(event.results) as any[])
                    .map((x: any[]) => first(x))
                    .map((y) => y.transcript);
                this._sprTimeout = setTimeout(() => {
                    this.listeningComplete$.next(true);
                    listenerFn();
                    // Stop listening
                    this.speechRecognizer.stop();
                    resolve(upperFirst(output.join('')))
                }, this.timeToComplete);
            });
            // Start listening
            this.speechRecognizer.start();
        })
    }

}

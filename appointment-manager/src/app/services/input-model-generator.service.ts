import { cloneDeep, each, first, includes, indexOf, isNil, size } from 'lodash-es';

import { Injectable } from '@angular/core';

import { Operations } from '../enums/operation.enum';
import { extractDateAndTime, identifyOperation } from '../helper';

@Injectable({
    providedIn: 'root'
})
export class InputModelGeneratorService {

    private _currentAction: Operations = Operations.Unknown;
    private _inputModel: any;
    private missing: string[] = [];

    constructor() { }

    public get currentAction(): Operations {
        return this._currentAction;
    }

    public set currentAction(v: Operations) {
        this._currentAction = v;
    }

    public get inputModel(): any {
        return this._inputModel;
    }

    public set inputModel(v: any) {
        this._inputModel = v;
    }

    public get missingInput() {
        return first(this.missing)
    }

    public get noMissingItems() {
        return !size(this.missing);
    }

    public get finalizeModel() {
        const copy = cloneDeep(this.inputModel);
        this.inputModel = {};
        return copy;
    }


    public updateMissingParameters(required: string[]) {
        each(this.inputModel, (val, key) => {
            if (isNil(val) && includes(required, key)) {
                this.missing.push(key);
            } else {
                const i = indexOf(this.missing, key);
                if (i > -1) {
                    this.missing.splice(i, 1);
                }
            }
        });
    }

    public getModelFromText(input: string) {
        const operation = identifyOperation(input);
        const isRelevant = /\Appointment/i.test(input) && this.noMissingItems;
        // For unrelated questions and operations throw an error
        if (!isRelevant || operation === Operations.Unknown) {
            throw new Error('Unknown');
        } else {
            this.currentAction = !this.noMissingItems ? this.currentAction : operation;
            const { date, time } = extractDateAndTime(input) ?? {};
            switch (this.currentAction) {
                case Operations.View:
                    this.inputModel['date'] = date;
                    this.updateMissingParameters(['date']);
                    break;
                case Operations.Update:
                    if (date) {
                        this.inputModel['date'] = date;
                        this.inputModel['time'] = time;
                        this.updateMissingParameters(['date', 'time']);
                    }
                    break;
                case Operations.Delete:
                    this.inputModel['date'] = date;
                    this.inputModel['time'] = time;
                    this.updateMissingParameters(['date', 'time']);
                    break;
            }
        }
        return { operation: this.currentAction };
    }

}

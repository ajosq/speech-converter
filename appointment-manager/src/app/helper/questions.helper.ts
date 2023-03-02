import { indexOf, isEmpty, isFunction, isNil, some, toNumber, upperFirst } from 'lodash-es';
import {
    deleteOperationKeys,
    getDate,
    modifyOperationKeys,
    monthKeys,
    monthRegEx,
    otherDateRegEx,
    questionKeys,
    viewOperationKeys
} from '../constants';
import { Operations } from '../enums/operation.enum';
import { regExTest } from './regex-test.helper';

export function isQuestion(inputStr: string) {
    return regExTest(questionKeys, inputStr);
}

export function identifyOperation(inputStr: string) {
    // Modify
    if (regExTest(modifyOperationKeys, inputStr)) {
        return Operations.Update;
        // Delete
    } else if (regExTest(deleteOperationKeys, inputStr)) {
        return Operations.Delete;
        // Read
    } else if (regExTest(viewOperationKeys, inputStr)) {
        return Operations.View;
        // Unknown
    } else {
        return Operations.Unknown;
    }
}

export function extractTime(inputStr: string) {
    const timeRegExp = /([01]?[0-9]|2[0-3]):([0-5][0-9])(?::([0-9][0-9]))? (p.m.|a.m.)/;
    return inputStr.match(timeRegExp)?.[0];
}

export function extractDateAndTime(inputStr: string) {
    const timeFromInputStr = extractTime(inputStr);
    const matchingText = inputStr.match(otherDateRegEx)?.[1];
    if (matchingText && isFunction(getDate[matchingText])) {
        return { date: getDate[matchingText](), time: timeFromInputStr };
    } else {
        let day: number | undefined;
        let month = new Date().getMonth();
        const year = new Date().getFullYear();
        let i;
        const numberRegExp = /[^0-9]/g;
        if (regExTest(monthKeys, inputStr)) {
            let result = inputStr.match(monthRegEx)?.[1];
            if (result) {
                const splitArr = inputStr.split(' ');
                i = indexOf(splitArr, result);
                month = indexOf(monthKeys, upperFirst(result));
                some([splitArr[i - 2], splitArr[i - 1], splitArr[i], splitArr[i + 1]], (str) => {
                    const strAfterReplace = str?.replace?.(numberRegExp, "");
                    if (!isEmpty(strAfterReplace)) {
                        day = toNumber(strAfterReplace);
                        return true;
                    }
                    return isNil(day) ? false : true;
                })
            }
        }
        let dateFromInputStr: Date | undefined;
        if (!isNil(day)) {
            dateFromInputStr = new Date();
            dateFromInputStr.setDate(day);
            dateFromInputStr.setMonth(month);
            dateFromInputStr.setFullYear(year);
        }
        return { date: dateFromInputStr?.toLocaleDateString(), time: timeFromInputStr };
    }
}
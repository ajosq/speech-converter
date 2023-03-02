import { some } from "lodash-es";

export function regExTest(inputArr: string[], inputStr: string) {
    return some(inputArr, (word) => new RegExp(word, 'i').test(inputStr)
    );
}
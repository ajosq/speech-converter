import { Operations } from "../enums";

export const AskForMoreInfo: any = {
    [Operations.View]: {
        date: "Could you please specify a date?"
    },
    [Operations.Delete]: {
        date: "Could you please specify the date and time of appointment?",
        time: "Sure, what time?"
    },
    [Operations.Update]: {},
    [Operations.Unknown]: {},
}
export const questionKeys = [
    'can',
    'could',
    'what',
    'when',
    'where',
    'which',
    'who',
    'why',
];
export const viewOperationKeys = ['display', 'list', 'read', 'show', 'view'];
export const deleteOperationKeys = [
    'delete',
    'remove',
    'strike out',
    'erase',
    'wipe out',
];
export const readOperationKeys = ['view', 'list', 'display', 'show', 'read'];
export const modifyOperationKeys = [
    'change',
    'correct',
    'modify',
    'revise',
    'update',
];

export const monthKeys = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const monthRegEx = /(January|February|March|April|May|June|July|August|September|October|November|December)/i;
export const otherDateRegEx = /(today|tomorrow|yesterday)/i;

export const getDate: { [key: string]: () => string } = {
    today: () => new Date().toLocaleDateString(),
    tomorrow: () => {
        var val = new Date();
        val.setDate(val.getDate() + 1);
        return val.toLocaleDateString();
    },
    yesterday: () => {
        var val = new Date();
        val.setDate(val.getDate() - 1);
        return val.toLocaleDateString();
    },
};

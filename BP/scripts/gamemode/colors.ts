export const tagPrefix: string = 'class_pvp:team_'

export function randomColor(): Color {
    return Math.round(Math.random() * 3);
}

export function tagFromColor(color: Color): string {
    return `${tagPrefix}${Color[color]}`;
}

export enum Color {
    "red",
    "blue",
    "yellow",
    "green"
}

export function chatColor(color: Color): string {
    return chatColorMap[Color[color]];
}

export const chatColorMap = {
    "red": "c",
    "blue": "1",
    "yellow": "g",
    "green": "a"
}
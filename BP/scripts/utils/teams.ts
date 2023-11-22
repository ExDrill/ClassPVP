import { Player } from "@minecraft/server";
import { Team } from './enums'
import { randomBetween } from './math'

const teams = {
    none: 'r',
    quartz: 'h',
    iron: 'i',
    netherite: 'j',
    redstone: 'm',
    copper: 'n',
    gold: 'p',
    emerald: 'q',
    diamond: 's',
    lapis: 't',
    amethyst: 'u'
}

export function getColorCode(player: Player): string {
    const team = player.getProperty('class_pvp:team') as string
    return teams[team]
}

export function applyRandomTeam(): string {
    const keys = Object.keys(Team)
    const chosenTeam = keys[randomBetween(1, keys.length - 1)]
    return Team[chosenTeam];
}
import { Player } from "@minecraft/server";
import { Team } from './enums'
import { randomBetween } from './math'

const teams: Map<string, string> = new Map()
teams.set('none', 'r')
teams.set('quartz', 'h')
teams.set('iron', 'i')
teams.set('netherite', 'j')
teams.set('redstone', 'm')
teams.set('copper', 'n')
teams.set('gold', 'p')
teams.set('emerald', 's')
teams.set('lapis', 't')
teams.set('amethyst', 'u')

export function getColorCode(player: Player): string {
    const team = player.getProperty('class_pvp:team') as string
    return teams.get(team)
}

export function applyRandomTeam(): string {
    const values = Object.values(Team)
    const chosenTeam = values[randomBetween(1, values.length - 1)]
    return chosenTeam
}
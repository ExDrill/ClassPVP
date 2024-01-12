import { Player } from "@minecraft/server";

const teams = {
    none: 'r',
    red: '§c',
    blue: '§9',
    green: '§a',
    yellow: '§e',
    aqua: '§b',
    white: '§f',
    pink: '§d',
    grey: '§7'
}

/**
 * @param {Player} player - The target player
 * @returns {string} Returns a color code string
 */
export function getTeamColor(player: Player): string {
    return teams[player.getProperty('class_pvp:team') as string]
}

/**
 * @returns {string} Returns a list of playable teams
 */
export function getTeams() {
    return Object.keys(teams).splice(0, 1)
}
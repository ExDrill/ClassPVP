import { world } from '@minecraft/server'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as Lobby from './mechanics/lobby'
/**
 * Registry for gamemodes 
 */
export const gamemodes = {
    'Deathmatch': new Deathmatch(),
    'Team Deathmatch': new TeamDeathmatch()
}

export const propertyGamemodes = {
    'none': 'none',
    'Deathmatch': 'deathmatch',
    'Team Deathmatch': 'team_deathmatch'
}

world.afterEvents.worldInitialize.subscribe(Lobby.initEndRound)
world.afterEvents.playerJoin.subscribe(Lobby.removeVoteOnJoin)
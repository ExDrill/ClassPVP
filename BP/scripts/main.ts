import { world } from '@minecraft/server'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as Lobby from './mechanics/lobby'

import PlayerClass from './playerClasses/playerClass'
import ArcherClass from './playerClasses/archer'

import Command from './commands/command'

/**
 * Registry for gamemodes 
 */
export const gamemodes = {
    'Deathmatch': new Deathmatch(),
    'Team Deathmatch': new TeamDeathmatch()
}

export const playerClasses: PlayerClass[] = [
    new ArcherClass()
]

world.afterEvents.worldInitialize.subscribe(Lobby.initEndRound)
world.afterEvents.playerJoin.subscribe(Lobby.removeVoteOnJoin)
world.beforeEvents.chatSend.subscribe(Command.commandEvent)
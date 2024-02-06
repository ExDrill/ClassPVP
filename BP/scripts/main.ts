import { world } from '@minecraft/server'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as Lobby from './mechanics/lobby'

import PlayerClass from './playerClasses/playerClass'
import WarriorClass from './playerClasses/warrior'
import ArcherClass from './playerClasses/archer'

import Command from './commands/command'
import EquipCommand from './commands/equip'
import EndCommand from './commands/end'
import SetCountdownCommand from './commands/setCountdown'
import StartCommand from './commands/start'

/**
 * Registry for gamemodes 
 */
export const gamemodes = {
    'Deathmatch': new Deathmatch(),
    'Team Deathmatch': new TeamDeathmatch()
}

export const playerClasses: Map<string, PlayerClass> = new Map([
    ['warrior', new WarriorClass()],
    ['archer', new ArcherClass()]
])

export const commands: Command[] = [
    new EquipCommand(),
    new EndCommand(),
    new SetCountdownCommand(),
    new StartCommand()
]

world.afterEvents.worldInitialize.subscribe(Lobby.initEndRound)
world.afterEvents.playerJoin.subscribe(Lobby.removeVoteOnJoin)
world.beforeEvents.chatSend.subscribe(Command.commandEvent)
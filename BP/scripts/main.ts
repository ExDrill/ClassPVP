import { world } from '@minecraft/server'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as Lobby from './mechanics/lobby'
import Command from './commands/command'
import EndCommand from './commands/end'
import StartCommand from './commands/start'
import SetCountdownCommand from './commands/set_countdown'

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

export const commands = {
    end: new EndCommand(),
    start: new StartCommand(),
    countdown: new SetCountdownCommand()
}

world.afterEvents.worldInitialize.subscribe(Lobby.initEndRound)
world.afterEvents.playerJoin.subscribe(Lobby.removeVoteOnJoin)
world.beforeEvents.chatSend.subscribe(Command.commandEvent)
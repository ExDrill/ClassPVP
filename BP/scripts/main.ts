import { world } from '@minecraft/server'

import Gamemode from './modes/gamemode'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as LobbyEvents from './events/lobbyEvents'

import PlayerClass from './playerClasses/playerClass'
import WarriorClass from './playerClasses/warrior'
import ArcherClass from './playerClasses/archer'

import Command from './commands/command'
import BossbarPosCommand from './commands/bossbarPositions'
import DebugCommand from './commands/debug'
import EquipCommand from './commands/equip'
import EventCommand from './commands/event'
import GameCommand from './commands/game'
import SetCountdownCommand from './commands/setCountdown'
import TimerCommand from './commands/timer'

import * as UI from './ui'

// Gamemode registry
export const GAMEMODES: Map<string, Gamemode> = new Map<string, Gamemode>([
    ['deathmatch', new Deathmatch()],
    ['team_deathmatch', new TeamDeathmatch()]
])

// Player class registry
export const PLAYER_CLASSES: Map<string, PlayerClass> = new Map([
    ['warrior', new WarriorClass()],
    ['archer', new ArcherClass()]
])

// Commands registry
export const COMMANDS: Command[] = [
    new BossbarPosCommand(),
    new DebugCommand(),
    new EquipCommand(),
    new EventCommand(),
    new GameCommand(),
    new SetCountdownCommand(),
    new TimerCommand()
]

UI.init()

world.afterEvents.worldInitialize.subscribe(LobbyEvents.init)
world.afterEvents.playerSpawn.subscribe(LobbyEvents.removeVoteOnSpawn)
world.beforeEvents.chatSend.subscribe(Command.init)


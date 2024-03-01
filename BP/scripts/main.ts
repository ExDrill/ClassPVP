import { world } from '@minecraft/server'

import Gamemode from './modes/gamemode'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/team_deathmatch'
import * as LobbyEvents from './events/lobby_events'

import PlayerClass from './player_classes/player_class'
import WarriorClass from './player_classes/warrior_class'
import ArcherClass from './player_classes/archer_class'

import Command from './commands/command'
import BossbarPosCommand from './commands/bossbar_position'
import DebugCommand from './commands/debug'
import EquipCommand from './commands/equip'
import EventCommand from './commands/event'
import GameCommand from './commands/game'
import SetCountdownCommand from './commands/countdown'
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


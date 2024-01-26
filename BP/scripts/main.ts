import { world } from '@minecraft/server'
import Gamemode from './modes/gamemode'
import Deathmatch from './modes/deathmatch'

/**
 * Registry for gamemodes 
 */
const gamemodes: Gamemode[] = [
    new Deathmatch()
]


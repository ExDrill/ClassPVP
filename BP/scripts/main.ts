import { world } from '@minecraft/server'
import Gamemode from './modes/gamemode'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'

/**
 * Registry for gamemodes 
 */

const gamemodes = {
    "Deathmatch": new Deathmatch(),
    "Team Deathmatch": new TeamDeathmatch()
}
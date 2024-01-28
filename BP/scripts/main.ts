import { world, system } from '@minecraft/server'
import Deathmatch from './modes/deathmatch'
import TeamDeathmatch from './modes/teamDeathmatch'
import * as Events from './mechanics/events'

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

world.afterEvents.worldInitialize.subscribe(event => {
    // Stop current game
})

world.afterEvents.playerJoin.subscribe(event => {
    const player = world.getPlayers({ name: event.playerName })[0]
    player.setProperty('class_pvp:vote', 'none')
    console.warn(player.getProperty('class_pvp:vote') as string)
})

world.afterEvents.playerInteractWithBlock.subscribe(Events.signVote)
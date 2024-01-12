import { Scoreboard, world } from '@minecraft/server'
import Gamemode from './gamemode'
import * as Events from '../mechanics/events'
import { createObjective } from '../utils/scoreboard'
import { shuffle } from '../utils/helper'
import { getTeams, getTeamColor } from '../utils/teams'

export default class Deathmatch extends Gamemode {

    public addObjectives(): void {
        createObjective('class_pvp:eliminations', 'Eliminations')
    }

    public enableEvents(): void {
        world.afterEvents.entityDie.subscribe(Events.rewardScore)
        world.afterEvents.entityDie.subscribe(Events.healthOnKill)
    }
    public disableEvents(): void {
        world.afterEvents.entityDie.unsubscribe(Events.rewardScore)
        world.afterEvents.entityDie.unsubscribe(Events.healthOnKill)
    }

    public assignTeams(): void {
        const players = world.getAllPlayers()
        const shuffledTeams = shuffle(getTeams())

        for (let i = 0; i < players.length; i++) {
            const player = players[i]
            const team = shuffledTeams[i]
            player.setProperty('class_pvp:team', team)
            player.nameTag = `${getTeamColor(player)}${player.name}`
        }
    }
}
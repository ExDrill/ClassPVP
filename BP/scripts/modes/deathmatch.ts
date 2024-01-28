import { world, DisplaySlotId, ObjectiveSortOrder } from '@minecraft/server'
import Gamemode from './gamemode'
import * as Events from '../mechanics/events'
import { createObjective, positionObjective } from '../utils/scoreboard'
import { shuffle } from '../utils/helper'
import { getTeams, getTeamColor } from '../utils/teams'

export default class Deathmatch extends Gamemode {
    public addObjectives(): void {
        createObjective('class_pvp:eliminations', 'Eliminations')
        createObjective('class_pvp:health', 'Health')
        positionObjective('class_pvp:eliminations', DisplaySlotId.Sidebar, ObjectiveSortOrder.Descending)
        positionObjective('class_pvp:health', DisplaySlotId.BelowName, ObjectiveSortOrder.Descending)
    }

    public enableEvents(): void {
        world.afterEvents.entityDie.subscribe(Events.rewardScore)
        world.afterEvents.entityDie.subscribe(Events.healthOnKill)
        world.afterEvents.entityHealthChanged.subscribe(Events.healthDisplay)
    }
    public disableEvents(): void {
        world.afterEvents.entityDie.unsubscribe(Events.rewardScore)
        world.afterEvents.entityDie.unsubscribe(Events.healthOnKill)
        world.afterEvents.entityHealthChanged.unsubscribe(Events.healthDisplay)
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
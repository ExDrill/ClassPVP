import { world, DisplaySlotId, ObjectiveSortOrder } from '@minecraft/server'
import Gamemode from './gamemode'
import { createObjective, positionObjective } from '../utils/scoreboard'
import * as Events from '../mechanics/events'
import { shuffle } from '../utils/helper'
import { getTeams, getTeamColor } from '../utils/teams'

export default class TeamDeathmatch extends Gamemode {
    public addObjectives() {
        createObjective('class_pvp:eliminations', 'Team Points')
        createObjective('class_pvp:health', 'Health')
        positionObjective('class_pvp:eliminations', DisplaySlotId.Sidebar, ObjectiveSortOrder.Descending)
        positionObjective('class_pvp:health', DisplaySlotId.BelowName, ObjectiveSortOrder.Descending)
    }

    public enableEvents() {
        world.afterEvents.entityDie.subscribe(Events.rewardTeamScore)
        world.afterEvents.entityDie.subscribe(Events.healthOnKill)
        world.afterEvents.entityHealthChanged.subscribe(Events.healthDisplay)
    }

    public disableEvents() {
        world.afterEvents.entityDie.unsubscribe(Events.rewardTeamScore)
        world.afterEvents.entityDie.unsubscribe(Events.healthOnKill)
        world.afterEvents.entityHealthChanged.unsubscribe(Events.healthDisplay)
    }

    public assignTeams() {
        const shuffledPlayers = shuffle(world.getAllPlayers())
        const shuffledTeams = shuffle(getTeams())

        const teamOne = shuffledTeams[0]
        const teamTwo = shuffledTeams[1]

        const playersOne = shuffledPlayers.slice(0, shuffledPlayers.length / 2)
        const playersTwo = shuffledPlayers.slice(shuffledPlayers.length / 2)

        for (const player of playersOne) {
            player.setProperty('class_pvp:team', teamOne)
            player.nameTag = `${getTeamColor(player)}${player.name}`
        }

        for (const player of playersTwo) {
            player.setProperty('class_pvp:team', teamTwo)
            player.nameTag = `${getTeamColor(player)}${player.name}`
        }
    }
}
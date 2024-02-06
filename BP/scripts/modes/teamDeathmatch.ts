import { world, DisplaySlotId, ObjectiveSortOrder } from '@minecraft/server'
import Gamemode from './gamemode'
import { createObjective, positionObjective, setScore } from '../utils/scoreboard'
import * as Events from '../mechanics/events'
import { shuffle } from '../utils/helper'
import { getTeams, getTeamColor, teams } from '../utils/teams'

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

        setScore('class_pvp:eliminations', teams[teamOne] + teamOne, 0)
        setScore('class_pvp:eliminations', teams[teamTwo] + teamTwo, 0)
    }

    public endRound() {
        this.determineWinner()
        super.endRound()
    }

    private determineWinner() {
        const objective = world.scoreboard.getObjective('class_pvp:eliminations')
        if (!objective) return

        const teamOne = objective.getParticipants()[0]
        const teamTwo = objective.getParticipants()[1]

        if (!teamOne || !teamTwo) return

        const oneScore = objective.getScore(teamOne)
        const twoScore = objective.getScore(teamTwo)
        const overworld = world.getDimension('overworld')
        if (oneScore > twoScore)
            overworld.runCommandAsync(`title @a title ${teamOne.displayName} wins§r`)
        else if (twoScore > oneScore)
            overworld.runCommandAsync(`title @a title ${teamTwo.displayName} wins§r`)
        else
            overworld.runCommandAsync(`title @a title tie`)
    }
}
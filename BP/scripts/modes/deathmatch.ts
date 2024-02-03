import { world, DisplaySlotId, ObjectiveSortOrder, ScoreboardIdentityType, Player } from '@minecraft/server'
import Gamemode from './gamemode'
import * as Events from '../mechanics/events'
import { createObjective, positionObjective, setScore } from '../utils/scoreboard'
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
            setScore('class_pvp:eliminations', player, 0)
        }
    }

    public endRound() {
        this.determineWinner()
        super.endRound()
    }

    private determineWinner() {
        const objective = world.scoreboard.getObjective('class_pvp:eliminations')
        if (!objective) return

        const players: Player[] = []
        objective.getParticipants()
            .filter(p => p.type === ScoreboardIdentityType.Player)
            .forEach(p => players.push(p.getEntity() as Player))

        let highestNames: string = ''
        let highestScore = 1
        for (const player of players) {
            const name = player.name
            const score = objective.getScore(player)
            if (score > highestScore) {
                highestScore = score
                highestNames = name + ', '
            } else if (score === highestScore)
                highestNames += name + ', '
        }
        if (highestNames !== '')
            highestNames = highestNames.substring(0, highestNames.length - 2)

        const overworld = world.getDimension('overworld')

        if (highestNames.length <= 1)
            overworld.runCommandAsync(`title @a title Nobody wins`)
        else if (highestNames.length === 1)
            overworld.runCommandAsync(`title @a title ${highestNames[0]} wins`)
        else
            overworld.runCommandAsync(`title @a title ${highestNames} win`)
    }
}
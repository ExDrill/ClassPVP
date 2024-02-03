import { world, Entity, ScoreboardObjective, DisplaySlotId, ObjectiveSortOrder, ScoreboardIdentity } from '@minecraft/server'

export function createObjective(id: string, displayName: string = id): void {
    world.scoreboard.addObjective(id, displayName)
}

export function positionObjective(id: string, displaySlot: DisplaySlotId, sortOrder: ObjectiveSortOrder): void {
    const objective = world.scoreboard.getObjective(id)
    world.scoreboard.setObjectiveAtDisplaySlot(displaySlot, {
        objective: objective,
        sortOrder: sortOrder
    })
}

export function deleteObjective(id: string): void {
    world.scoreboard.removeObjective(id)
}

export function getObjectives(): ScoreboardObjective[] {
    return world.scoreboard.getObjectives()
}

export function removeObjectives(): void {
    for (const objective of getObjectives()) {
        deleteObjective(objective.id)
    }
}

export function getScore(objectiveID: string, participant: string | Entity | ScoreboardIdentity): number {
    return world.scoreboard.getObjective(objectiveID).getScore(participant)
}

export function setScore(objectiveID: string, participant: string | Entity | ScoreboardIdentity, score: number): void {
    world.scoreboard.getObjective(objectiveID).setScore(participant, score)
}

export function addScore(objectiveID: string, participant: string | Entity | ScoreboardIdentity, score: number): void {
    world.scoreboard.getObjective(objectiveID).addScore(participant, score)
}
import { world, Entity, Scoreboard, ScoreboardObjective } from '@minecraft/server'

export default class ScoreboardManager {
    private scoreboard: Scoreboard = world.scoreboard

    public constructor() {
        
    }

    public addObjective(id: string, displayName: string = id): void {
        this.scoreboard.addObjective(id, displayName)
    }

    public getObjective(id: string): ScoreboardObjective {
        return this.scoreboard.getObjective(id)
    }

    public getScore(participant: Entity, objectiveID: string): number {
        const objective = this.getObjective(objectiveID)
        return objective.getScore(participant)
    }

    public setScore(participant: Entity, objectiveID: string, value: number): void {
        const objective = this.getObjective(objectiveID)
        objective.setScore(participant, value)
    }

    public addScore(participant: Entity, objectiveID: string, value: number): void {
        const objective = this.getObjective(objectiveID)
        objective.addScore(participant, value)
    }
}
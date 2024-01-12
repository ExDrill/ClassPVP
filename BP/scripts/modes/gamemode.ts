import { world, system } from '@minecraft/server'
import { removeObjectives } from '../utils/scoreboard'

export default abstract class Gamemode {
    private ongoingInterval?: number
    private roundDurationTicks: number

    public constructor(roundDurationTicks = 4800) {
        this.roundDurationTicks = roundDurationTicks
    }

    public startRound(): void {
        if (this.ongoingInterval) {
            console.warn('Warning: There is already an ongoing round!')
            return
        }
        this.ongoingInterval = system.runInterval(this.tick, 1)
        this.enableEvents()
        this.addObjectives()
        this.assignTeams()
        Gamemode.setRoundTime(this.roundDurationTicks)
    }

    public endRound(): void {
        if (!this.ongoingInterval) {
            console.warn('Warning: There is currently no ongoing round!')
            return
        }
        system.clearRun(this.ongoingInterval)
        this.ongoingInterval = undefined
        this.disableEvents()
        removeObjectives()
    }

    /**
     * Override to add scoreboard objectives
     */
    public abstract addObjectives(): void
    
    /**
     * Override to subscribe to all needed events
     */
    public abstract enableEvents(): void

    /**
     * Override to unsubscribe to all needed events
     */
    public abstract disableEvents(): void

    /**
     * Handles the logic for assigning teams
     */
    public abstract assignTeams(): void

    /**
     * The base tick for all gamemodes
     */
    public tick(): void {
        const roundTime = Gamemode.getRoundTime()
        if (roundTime - 1 == 0) {
            this.endRound()
        }
        else {
            Gamemode.setRoundTime(roundTime - 1)
        }
    }

    protected static getRoundTime(): number {
        return world.getDynamicProperty('class_pvp:round_time') as number
    }

    protected static setRoundTime(value: number): void {
        world.setDynamicProperty('class_pvp:round_time', value)
    }

    public static isOngoingRound(): boolean {
        return this.getRoundTime() > 0
    }
}
import { world, system, EntityComponentTypes } from '@minecraft/server'
import { removeObjectives } from '../utils/scoreboard'
import { startIntermission } from '../events/lobbyEvents'
import * as Events from '../events/gameEvents'
import * as Bossbar from '../utils/bossbarHelper'
import { PLAYER_CLASSES } from '../main'

export default abstract class Gamemode {
    private ongoingInterval?: number
    // private roundDurationTicks: number = 4800
    private roundDurationTicks: number = 400

    public startRound(): void {
        if (this.ongoingInterval) {
            console.warn('Warning: There is already an ongoing round!')
            return
        }
        this.ongoingInterval = system.runInterval(this.tick.bind(this), 1)
        world.beforeEvents.chatSend.subscribe(Events.chatColor)
        this.enableEvents()
        for (const playerClass of PLAYER_CLASSES.values()) {
            playerClass.enableEvents()
        }
        this.addObjectives()
        this.assignTeams()
        Gamemode.setRoundTime(this.roundDurationTicks)
        Bossbar.createBossbarEntity()
    }

    public endRound(): void {
        // if (!this.ongoingInterval) {
        //     console.warn('Warning: There is currently no ongoing round!')
        //     return
        // }
        if (this.ongoingInterval)
            system.clearRun(this.ongoingInterval)
        this.ongoingInterval = undefined
        world.beforeEvents.chatSend.unsubscribe(Events.chatColor)
        Bossbar.clearBossbars()
        this.disableEvents()
        for (const playerClass of PLAYER_CLASSES.values()) {
            playerClass.disableEvents()
        }
        removeObjectives()
        startIntermission()
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
            Bossbar.getBossbarEntities().forEach(entity => {
                const healthComponent = entity.getComponent(EntityComponentTypes.Health)
                healthComponent.setCurrentValue(((roundTime - 1) / this.roundDurationTicks) * healthComponent.effectiveMax)
            })
        }
    }

    public setRoundDuration(durationTicks: number): void {
        this.roundDurationTicks = durationTicks
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
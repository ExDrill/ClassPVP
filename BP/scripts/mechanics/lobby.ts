import { system, world } from '@minecraft/server'
import * as Events from './events'
import { propertyGamemodes, gamemodes } from '../main'

let intermissionInterval: number

function startIntermission(): void {
    for (const player of world.getAllPlayers())
        player.setProperty('class_pvp:vote', 'none')

    intermissionInterval = system.runInterval(() => {
        decrementCountdown()
        if (getCountdown() <= 0) {
            stopCountdown()
            startGame()
        }
    }, 20)
}

function startGame(): void {
    for (const player of world.getAllPlayers()) {
        const vote = player.getProperty('class_pvp:vote') as string
        // if (Object.keys(propertyGamemodes).includes(vote))

    }
}

function stopCountdown(): void {
    system.clearRun(intermissionInterval)
    setCountdown(0)
    intermissionInterval = undefined
    world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)
}

function decrementCountdown(): void {
    setCountdown(getCountdown() - 1)
}

function setCountdown(value: number): void {
    world.setDynamicProperty('class_pvp:intermission_time', value)
}

function getCountdown(): number {
    return world.getDynamicProperty('class_pvp:intermission_time') as number
}
import { system, world, Player, WorldInitializeAfterEvent, PlayerSpawnAfterEvent } from '@minecraft/server'
import * as Events from './gameEvents'
import { GAMEMODES } from '../main'

let intermissionInterval: number

/**
 * @returns Countdown length in ticks
 */
export function getCountdownLength(): number {
    return world.getDynamicProperty('class_pvp:intermission_length') as number
}

/**
 * @param {number} ticks Set countdown length in ticks
 */
export function setCountdownLength(ticks: number): void {
    const lastTicks = getCountdownLength()

    if (ticks < 0)
        ticks = -1
    else if (ticks < 100)
        ticks = 100

    world.setDynamicProperty('class_pvp:intermission_length', ticks)
    if (lastTicks < 0 && ticks > 0)
        startCountdown()
}

/**
 * Ends the ongoing round and sets default countdown
 * @param {WorldInitializeAfterEvent} event World initialize event
 */
export function init(event: WorldInitializeAfterEvent): void {
    const dimension = world.getDimension('overworld')
    dimension.runCommand('function gamerules')

    if (!getCountdownLength()) {
        setCountdownLength(1200)
    }
    const interval = system.runInterval(() => {
        const players = world.getAllPlayers()
        if (players.length <= 0) return
        system.clearRun(interval)

        endGame()
    }, 60)
}

/**
 * Removes the vote of a player that has just joined
 * @param {PlayerJoinAfterEvent} event Player Join Event
 */
export function removeVoteOnSpawn(event: PlayerSpawnAfterEvent): void {
    const player = event.player

    if (event.initialSpawn) {
        player.setDynamicProperty('class_pvp:vote', 'none')
    }
}

/**
 * Starts the game found in the class_pvp:gamemode dynamic property
 */
export function startGame(): void {
    const modeName = world.getDynamicProperty('class_pvp:gamemode') as string
    const gamemode = GAMEMODES.get(modeName)

    if (gamemode)
        gamemode.startRound()
}

export function endGame(): void {
    const gamemodeId = world.getDynamicProperty('class_pvp:gamemode') as string
    if (gamemodeId && gamemodeId !== 'none') {
        const gamemode = GAMEMODES.get(gamemodeId)
        if (gamemode) {
            gamemode.endRound()
        }
    }
}

/**
 * Gets the player's vote
 * @param {Player} player The player
 */
export function getPlayerVote(player: Player): string {
    return player.getDynamicProperty('class_pvp:vote') as string
}

/**
 * Starts the intermission period before a match
 */
export function startIntermission(): void {
    for (const player of world.getAllPlayers())
        player.setDynamicProperty('class_pvp:vote', 'none')

    if (getCountdownLength() >= 0)
        startCountdown()
    world.afterEvents.itemUse.subscribe(Events.compassVote)
    world.afterEvents.itemUse.subscribe(Events.classSelect)
    // world.afterEvents.playerInteractWithBlock.subscribe(Events.signVote)
}

export function startCountdown() {
    setCountdown(getCountdownLength())
    intermissionInterval = system.runInterval(() => intermissionTick(), 1)
}

/**
 * Tick function used to count down to zero
 */
function intermissionTick(): void {
    const countdown = getCountdown()
    decrementCountdown()

    const seconds = countdown * .05
    const player = world.getAllPlayers()[0]
    if (player)
        player.dimension.runCommandAsync(`title @a actionbar Game starts in: ${Math.ceil(seconds)}`)

    if (countdown <= 0) {
        stopCountdown()
        if (countdown === 0) {
            endVote()
            system.runTimeout(() => startGame(), 1)
        }
    }
}

/**
 * Ends the voting period and sets the gamemode to the winner.
 */
export function endVote(): void {
    world.afterEvents.itemUse.unsubscribe(Events.compassVote)
    world.afterEvents.itemUse.unsubscribe(Events.classSelect)
    // world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)

    const voteMap = new Map<string, number>()
    const modeKeys = Array.from(GAMEMODES.keys())
    for (const key of modeKeys)
        voteMap.set(key, 0)

    for (const player of world.getAllPlayers()) {
        let gamemode: string = getPlayerVote(player);
        if (!gamemode) continue

        const lastValue = voteMap.get(gamemode)
        voteMap.set(gamemode, lastValue + 1)
    }

    let gamemode: string = 'none'
    let mostCount: number = 0
    for (const entry of voteMap.entries()) {
        const key = entry[0]
        const value = entry[1]

        if (value > mostCount) {
            gamemode = key
            mostCount = value
        }
    }

    if (!gamemode || gamemode === 'none') {
        const random = Math.floor(Math.random() * GAMEMODES.size);
        gamemode = modeKeys[random]
    }

    world.setDynamicProperty('class_pvp:gamemode', gamemode)
    world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)
}

/**
 * Stops the intermission countdown
 */
export function stopCountdown(): void {
    if (intermissionInterval)
        system.clearRun(intermissionInterval)
    setCountdown(0)
    intermissionInterval = undefined
}

function decrementCountdown(): void {
    setCountdown(getCountdown() - 1)
}

export function setCountdown(value: number): void {
    world.setDynamicProperty('class_pvp:intermission_time', value)
}

export function getCountdown(): number {
    return world.getDynamicProperty('class_pvp:intermission_time') as number
}
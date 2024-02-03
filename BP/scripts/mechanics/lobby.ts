import { system, world, Player, WorldInitializeAfterEvent, PlayerJoinAfterEvent } from '@minecraft/server'
import * as Events from './events'
import { propertyGamemodes, gamemodes } from '../main'
import Gamemode from '../modes/gamemode'
import { keyOf } from '../utils/helper'

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
    if (ticks < 100)
        ticks = 100

    world.setDynamicProperty('class_pvp:intermission_length', ticks)
}

/**
 * Ends the ongoing round and sets default countdown
 * @param {WorldInitializeAfterEvent} event World initialize event
 */
export function initEndRound(event: WorldInitializeAfterEvent): void {
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
export function removeVoteOnJoin(event: PlayerJoinAfterEvent): void {
    const interval = system.runInterval(() => {
        const player = world.getPlayers({ name: event.playerName })[0]
        if (!player) return
        system.clearRun(interval)
        player.setProperty('class_pvp:vote', 'none')
    }, 1)
}

export function endGame(): void {
    const property = world.getDynamicProperty('class_pvp:gamemode') as string
    if (property && property !== 'none') {
        const gameName = proptertyToName(property)
        const gamemode = gamemodes[gameName] as Gamemode
        gamemode.endRound()
    }

    startIntermission()
}

/**
 * Converts the vote property string to a mode's name
 * @param {string} vote The vote property
 */
export function proptertyToName(vote: string): string {
    return keyOf(vote, propertyGamemodes)
}

/**
 * Converts the player's vote property to a mode's name
 * @param {Player} player The player
 */
export function playerPropertyToName(player: Player): string {
    const vote = player.getProperty('class_pvp:vote') as string
    if (vote === 'none') return undefined

    return proptertyToName(vote)
}

/**
 * Starts the intermission period before a match
 */
export function startIntermission(): void {
    for (const player of world.getAllPlayers())
        player.setProperty('class_pvp:vote', 'none')

    setCountdown(getCountdownLength())
    intermissionInterval = system.runInterval(() => intermissionTick(), 1)
    world.afterEvents.playerInteractWithBlock.subscribe(Events.signVote)
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
        endVote()
        system.runTimeout(() => startGame(), 1)
    }
}

/**
 * Ends the voting period and sets the gamemode to the winner.
 */
export function endVote(): void {
    stopCountdown()
    world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)

    const voteMap = new Map<string, number>()
    const modeKeys = Object.keys(gamemodes)
    for (const key of modeKeys)
        voteMap.set(key, 0)

    for (const player of world.getAllPlayers()) {
        let gamemode: string = playerPropertyToName(player);
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
        const random = Math.floor(Math.random() * modeKeys.length);
        gamemode = modeKeys[random]
    }

    world.setDynamicProperty('class_pvp:gamemode', propertyGamemodes[gamemode])
    world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)
}

/**
 * Starts the game found in the class_pvp:gamemode dynamic property
 */
export function startGame(): void {
    const modeName = proptertyToName(world.getDynamicProperty('class_pvp:gamemode') as string)
    const gamemode = gamemodes[modeName] as Gamemode

    gamemode.startRound()
}

/**
 * Stops the intermission countdown
 */
function stopCountdown(): void {
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
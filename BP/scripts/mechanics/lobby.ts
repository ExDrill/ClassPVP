import { system, world, Player, WorldInitializeAfterEvent, PlayerJoinAfterEvent } from '@minecraft/server'
import * as Events from './events'
import { propertyGamemodes, gamemodes } from '../main'
import Gamemode from '../modes/gamemode'

// const countDownLength = 1200
const countDownLength = 200
let intermissionInterval: number

export function initEndRound(event: WorldInitializeAfterEvent): void {
    const interval = system.runInterval(() => {
        const players = world.getAllPlayers()
        if (players.length <= 0) return
        system.clearRun(interval)

        endGame()
    }, 60)
}

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

export function proptertyToName(vote: string): string {
    const entries = Object.entries(propertyGamemodes)
    for (const entry of entries) {
        const key = entry[0]
        const value = entry[1]

        if (value === vote)
            return key
    }

    return undefined
}

export function playerPropertyToName(player: Player): string {
    const vote = player.getProperty('class_pvp:vote') as string
    if (vote === 'none') return undefined
    if (!Object.values(propertyGamemodes).includes(vote)) return undefined

    return proptertyToName(vote)
}

export function startIntermission(): void {
    for (const player of world.getAllPlayers())
        player.setProperty('class_pvp:vote', 'none')

    setCountdown(countDownLength)
    intermissionInterval = system.runInterval(() => intermissionTick(), 1)
    world.afterEvents.playerInteractWithBlock.subscribe(Events.signVote)
}

function intermissionTick(): void {
    const countdown = getCountdown()
    decrementCountdown()

    const seconds = countdown * .05
    const player = world.getAllPlayers()[0]
    if (player)
        player.dimension.runCommandAsync(`title @a actionbar Game starts in: ${Math.ceil(seconds)}`)

    if (countdown <= 0) {
        stopCountdown()
        endVote()
        system.runTimeout(() => startGame(), 1)
    }
}

export function endVote(): void {
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

export function startGame(): void {
    const modeName = proptertyToName(world.getDynamicProperty('class_pvp:gamemode') as string)
    const gamemode = gamemodes[modeName] as Gamemode

    gamemode.startRound()
}

function stopCountdown(): void {
    system.clearRun(intermissionInterval)
    setCountdown(0)
    world.afterEvents.playerInteractWithBlock.unsubscribe(Events.signVote)
    intermissionInterval = undefined
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
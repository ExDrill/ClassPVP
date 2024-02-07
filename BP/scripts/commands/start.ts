import { system } from '@minecraft/server'
import Command from './command'
import { getCountdown, endVote, startGame, stopCountdown } from '../events/lobbyEvents'

export default class StartCommand extends Command {
    public constructor() {
        super('start', true)
    }

    public run(event) {
        if (getCountdown() < 0) return

        stopCountdown()
        endVote()
        system.runTimeout(() => startGame(), 1)
    }
}
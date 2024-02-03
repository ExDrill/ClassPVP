import Command from './command'
import { getCountdown, endVote, startGame } from '../mechanics/lobby'

export default class StartCommand extends Command {
    public constructor() {
        super('start', true)
    }

    public run(event) {
        if (getCountdown() < 0) return

        endVote()
        startGame()
    }
}
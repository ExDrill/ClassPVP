import Command from './command'
import { endGame } from '../mechanics/lobby'

export default class EndCommand extends Command {
    public constructor() {
        super('end', true)
    }

    public run(event) {
        endGame()
    }
}
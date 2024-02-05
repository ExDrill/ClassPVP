import { setCountdownLength, setCountdown } from '../mechanics/lobby'
import Command from './command'

export default class SetCountdownCommand extends Command {
    public constructor() {
        super('countdown', true, ['number'])
    }

    public run(event, args: (string | number)[]): void {
        const length = args[0] as number

        setCountdownLength(length)
        setCountdown(length)
    }
}
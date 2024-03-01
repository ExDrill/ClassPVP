import { setCountdownLength, setCountdown } from '../events/lobby_events'
import Command, { ArgType } from './command'

export default class SetCountdownCommand extends Command {
    public constructor() {
        super('countdown', true, ['number'])
    }

    public run(event, args: ArgType[]): void {
        const length = args[0] as number

        setCountdownLength(length)
        setCountdown(length)
    }
}
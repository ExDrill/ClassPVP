import { ChatSendBeforeEvent, system } from '@minecraft/server'
import { getCommand } from './index'

export default abstract class Command {
    public name: string
    public requiresOp: boolean
    public argTypes: ('string' | 'number')[]

    protected constructor(name: string, requiresOp: boolean, argTypes?: ('string' | 'number')[]) {
        this.name = name
        this.requiresOp = requiresOp
        this.argTypes = argTypes
    }

    protected getArgs(argString: string): (string | number)[] {
        if (!this.argTypes) return undefined

        const splitArgs = argString.split(' ')
        const args: (string | number)[] = []

        for (let i = 0; i < this.argTypes.length; i++) {
            const type = this.argTypes[i]
            const arg = splitArgs[i]

            if (type === 'string')
                args.push(arg)
            else if (type === 'number')
                args.push(Number.parseInt(arg))
            else
                throw new TypeError('Invalid type')
        }

        return args
    }

    public static commandEvent(event: ChatSendBeforeEvent) {
        const sender = event.sender
        const message = event.message
        const command = getCommand(message)
        if (!command) return
        event.cancel = true
        if (command.requiresOp && !sender.isOp()) return

        system.run(() => {
            if (command.argTypes) {
                const argString = message.substring(command.name.length + 2)
                const args = command.getArgs(argString)
                command.run(event, args)
            } else
                command.run(event)
        })
    }

    public abstract run(event: ChatSendBeforeEvent, args?: (string | number)[]): void
}
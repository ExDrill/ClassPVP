import { ChatSendBeforeEvent, system } from '@minecraft/server'
import { COMMANDS } from '../main'
import { parseBoolean } from '../utils/helper'

export const prefix = '!'

export type ArgType = string | number | boolean
type StringTypes = 'string' | 'number' | 'boolean'

export default abstract class Command {
    public name: string
    public requiresOp: boolean
    public argTypes: StringTypes[]

    protected constructor(name: string, requiresOp: boolean, argTypes?: StringTypes[]) {
        this.name = name
        this.requiresOp = requiresOp
        this.argTypes = argTypes
    }

    protected getArgs(argString: string): ArgType[] {
        if (!this.argTypes) return undefined

        const splitArgs = argString.split(' ')
        const args: ArgType[] = []

        for (let i = 0; i < this.argTypes.length; i++) {
            const type = this.argTypes[i]
            const arg = splitArgs[i]

            if (type === 'string')
                args.push(arg)
            else if (type === 'number')
                args.push(Number.parseInt(arg))
            else if (type === 'boolean')
                args.push(parseBoolean(arg))
            else
                throw new TypeError('Invalid type')
        }

        return args
    }

    public static init(event: ChatSendBeforeEvent) {
        const sender = event.sender
        const message = event.message
        const command = Command.getCommand(message)
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

    public static getCommand(commandString: string): Command {
        if (!commandString.startsWith(prefix)) return undefined
        const spaceIdx = commandString.indexOf(' ')
        let name: string
        if (spaceIdx < 0)
            name = commandString.substring(1)
        else
            name = commandString.substring(1, spaceIdx)

        return COMMANDS.find(command => command.name === name)
    }

    public abstract run(event: ChatSendBeforeEvent, args?: ArgType[]): void
}
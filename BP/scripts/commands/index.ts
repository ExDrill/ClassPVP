import Command from './command'
import EndCommand from './end'
import SetCountdownCommand from './set_countdown'
import StartCommand from './start'

export const prefix = '!'

export const commands: Command[] = [
    new EndCommand(),
    new SetCountdownCommand(),
    new StartCommand()
]

export function getCommand(commandString: string): Command {
    if (!commandString.startsWith(prefix)) return undefined
    const spaceIdx = commandString.indexOf(' ')
    let name: string
    if (spaceIdx < 0)
        name = commandString.substring(1)
    else
        name = commandString.substring(1, spaceIdx)

    return commands.find(command => command.name === name)
}
import { ChatSendBeforeEvent } from '@minecraft/server'
import Command, { ArgType } from './command'
import { PLAYER_CLASSES } from '../main'

export default class EventCommand extends Command {

    public constructor() {
        super('event', true, ['string', 'string'])
    }

    public run(event: ChatSendBeforeEvent, args?: ArgType[]): void {
        const player = event.sender
        const subCommand = args[0] as string
        const selectedClass = PLAYER_CLASSES.get(args[1] as string)

        if (!PLAYER_CLASSES.has(args[1] as string)) {
            player.sendMessage(`Unrecognized player class '${subCommand}'.`)
            return
        }

        if (subCommand == 'enable') {
            player.sendMessage(`Enabled events for the '${selectedClass.getID()}' player class.`)
            selectedClass.enableEvents()
        }
        else if (subCommand == 'disable') {
            player.sendMessage(`Disabled events for the '${selectedClass.getID()}' player class.`)
            selectedClass.disableEvents()
        }
        else {
            player.sendMessage(`Unrecognized subcommand '${subCommand}'.`)
        }
    }
}
import { ChatSendBeforeEvent } from '@minecraft/server'
import Command, { ArgType } from './command'
import { playerClasses } from '../main'

export default class EquipCommand extends Command {
    public constructor() {
        super('equip', true, ['string'])
    }

    public run(event: ChatSendBeforeEvent, args?: ArgType[]): void {
        const player = event.sender
        const chosenClass = args[0] as string
        const playerClass = playerClasses.get(chosenClass)

        if (chosenClass == 'none') {
            player.runCommand('clear @s')
            player.setProperty('class_pvp:player_class', 'none')
            player.sendMessage('Cleared player class!')
        }
        else if (!playerClass) {
            player.sendMessage(`Failed to equip class. Player class '${chosenClass}' does not exist.`)
        }
        else {
            player.setProperty('class_pvp:player_class', playerClass.getID())
            playerClass.equip(player)
            player.sendMessage(`Successfully equipped '${playerClass.getID()}'`)
        }
    }
}
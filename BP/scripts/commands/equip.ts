import { ChatSendBeforeEvent } from '@minecraft/server'
import Command, { ArgType } from './command'
import { PLAYER_CLASSES } from '../main'

export default class EquipCommand extends Command {
    public constructor() {
        super('equip', true, ['string'])
    }

    public run(event: ChatSendBeforeEvent, args?: ArgType[]): void {
        const player = event.sender
        const chosenClass = args[0] as string
        const playerClass = PLAYER_CLASSES.get(chosenClass)

        player.runCommand('clear @s')
        if (chosenClass == 'none') {
            player.triggerEvent('class_pvp:refresh_player')
            player.sendMessage('Cleared player class!')
        }
        else if (!playerClass) {
            player.sendMessage(`Failed to equip class. Player class '${chosenClass}' does not exist.`)
        }
        else {
            player.triggerEvent(`class_pvp:switch_to_${playerClass.getID()}`)
            playerClass.equip(player)
            player.sendMessage(`Successfully equipped '${playerClass.getID()}'`)
        }
    }
}
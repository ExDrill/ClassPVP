import { world, system, Player, EquipmentSlot, ItemStack, ItemUseAfterEvent } from '@minecraft/server'
import PlayerClass from './playerClass'

export default class ArcherClass extends PlayerClass {

    public constructor() {
        super('archer')

        this.createEvents()
    }

    public createEvents(): void {
        world.afterEvents.itemUse.subscribe(ArcherClass.reloadDaggers)
    }

    public destroyEvents(): void {
        world.afterEvents.itemUse.unsubscribe(ArcherClass.reloadDaggers)
    }

    public equip(player: Player) {
        const inventory = player.getComponent('minecraft:inventory')
        const container = inventory.container
        const equippable = player.getComponent('minecraft:equippable')

        equippable.setEquipment(EquipmentSlot.Head, PlayerClass.createItemStack('class_pvp:archer_helmet'))

        container.setItem(0, PlayerClass.createItemStack('minecraft:bow'))
        container.setItem(1, ArcherClass.createThrowingDagger('slowness', 3))
        container.setItem(2, ArcherClass.createThrowingDagger('poison', 1))

        for (let i = 9; i <= 17; i++) {
            container.setItem(i, ArcherClass.createArrows())
        }
    }

    private static createThrowingDagger(variant: string, amount: number): ItemStack {
        const stack = PlayerClass.createItemStack(`class_pvp:${variant}_throwing_dagger`)
        const firstLetter = variant.charAt(0)
        const lore = firstLetter.toUpperCase() + variant.replace(firstLetter, '')

        stack.setLore([lore])
        stack.amount = amount
        return stack
    }

    private static reloadDaggers(event: ItemUseAfterEvent): void {
        const user = event.source
        const inventory = user.getComponent('minecraft:inventory')
        const container = inventory.container
        const stack = event.itemStack
        
        if (user.getItemCooldown('throwing_dagger') > 0) return
        
        if (stack.amount == 1) {
            if (stack.typeId == 'class_pvp:slowness_throwing_dagger') {
                const stack = ArcherClass.createThrowingDagger('slowness', 3)
                system.runTimeout(() => container.setItem(1, stack), 50)
            }
            if (stack.typeId == 'class_pvp:poison_throwing_dagger') {
                const stack = ArcherClass.createThrowingDagger('poison', 1)
                system.runTimeout(() => container.setItem(2, stack), 100)
            }
        }
    }

    private static createArrows(): ItemStack {
        const stack = PlayerClass.createItemStack('minecraft:arrow')
        stack.amount = 64
        return stack
    }
}


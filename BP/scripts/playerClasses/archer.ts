import { world, Player, EquipmentSlot, ItemStack } from '@minecraft/server'
import * as Events from '../events/archerEvents'
import PlayerClass from './playerClass'

export default class ArcherClass extends PlayerClass {

    public constructor() {
        super('archer')
    }

    public enableEvents(): void {
        world.afterEvents.projectileHitEntity.subscribe(Events.hitEntityEffects)
        world.afterEvents.projectileHitBlock.subscribe(Events.hitBlockEffects)
    }

    public disableEvents(): void {
        world.afterEvents.projectileHitEntity.unsubscribe(Events.hitEntityEffects)
        world.afterEvents.projectileHitBlock.unsubscribe(Events.hitBlockEffects)
    }

    public equip(player: Player) {
        const inventory = player.getComponent('minecraft:inventory')
        const container = inventory.container
        const equippable = player.getComponent('minecraft:equippable')

        equippable.setEquipment(EquipmentSlot.Chest, PlayerClass.createItemStack('class_pvp:archer_armor'))
        container.setItem(0, ArcherClass.createBow())
        container.setItem(1, ArcherClass.createThrowingDagger('slowness', 3))
        container.setItem(2, ArcherClass.createThrowingDagger('poison', 1))
        container.setItem(9, PlayerClass.createItemStack('minecraft:arrow'))

        // for (let i = 9; i <= 17; i++) {
        //     container.setItem(i, ArcherClass.createArrows())
        // }
    }

    public static createThrowingDagger(variant: string, amount: number): ItemStack {
        const stack = PlayerClass.createItemStack(`class_pvp:${variant}_throwing_dagger`)
        const firstLetter = variant.charAt(0)
        const lore = firstLetter.toUpperCase() + variant.replace(firstLetter, '')

        stack.setLore([lore])
        stack.amount = amount
        return stack
    }

    private static createBow(): ItemStack {
        const bow = ArcherClass.createItemStack('minecraft:bow')
        const enchants = bow.getComponent('minecraft:enchantable')
        enchants.addEnchantment({
            type: 'infinity',
            level: 1
        })
        return bow
    }

    private static createArrows(): ItemStack {
        const stack = PlayerClass.createItemStack('minecraft:arrow')
        stack.amount = 64
        return stack
    }
}


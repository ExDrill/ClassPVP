import { Player, ItemStack, ItemLockMode } from '@minecraft/server'

export default abstract class PlayerClass {
    private id: string

    public constructor(id: string) {
        this.id = id
    }

    public abstract equip(player: Player): void

    public getID(): string {
        return this.id
    }

    protected static createItemStack(item: string, lockMode: ItemLockMode = ItemLockMode.slot): ItemStack {
        const stack = new ItemStack(item)
        stack.lockMode = lockMode
        return stack
    }
}
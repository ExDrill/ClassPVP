import { world, Dimension, EntityHurtAfterEvent, Vector, Player, Entity, EquipmentSlot, EntityDamageCause } from '@minecraft/server'

export function performSweepAttack(event: EntityHurtAfterEvent) {
    const damageSource = event.damageSource
    const victim = event.hurtEntity
    const attacker = damageSource.damagingEntity

    if (!(attacker instanceof Player) || attacker.isFalling || damageSource.cause != EntityDamageCause.entityAttack) return
    
    const mainhandStack = attacker.getComponent('minecraft:equippable').getEquipment(EquipmentSlot.Mainhand)
    if (!mainhandStack || mainhandStack.typeId != 'minecraft:stone_sword') return

    const dimension = attacker.dimension
    const sweepPos = getSweepPos(attacker, victim)
    const entities = dimension.getEntities({
        location: sweepPos,
        maxDistance: 3
    })
    for (const entity of entities) {
        entity.applyDamage(3, {
            cause: EntityDamageCause.none,
            damagingEntity: attacker
        })
    }
    sweepEffects(dimension, sweepPos)
}

function sweepEffects(dimension: Dimension, pos: Vector) {
    dimension.spawnParticle('class_pvp:sweep', pos)
    world.playSound('random.sweep', pos)
}

function getSweepPos(attacker: Entity, victim: Entity) {
    return Vector.divide(Vector.add(attacker.getHeadLocation(), victim.getHeadLocation()), 2)
}
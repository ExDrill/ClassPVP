export default defineComponent((context) => {
    context.name('class_pvp:armor')
    context.schema({
        type: 'object',
        additionalProperties: false,
        properties: {
            slot: {
                type: 'string',
                enum: [
                    'helmet',
                    'chestplate',
                    'leggings',
                    'boots'
                ]
            },
            protection: {
                type: 'integer'
            }
        }
    })
    context.template(({ slot, protection }, { create }) => {
        create(
            {
                'minecraft:icon': {
                    'texture': slot,
                    'frame': 0
                },
                'minecraft:wearable': {
                    'slot': wearableSlots.get(slot),
                    'protection': protection
                },
                'minecraft:max_stack_size': 1
            },
            'minecraft:item/components'
        )
    })
})

const wearableSlots: Map<string, string> = new Map()
wearableSlots.set('helmet', 'slot.armor.head')
wearableSlots.set('chestplate', 'slot.armor.chest')
wearableSlots.set('leggings', 'slot.armor.legs')
wearableSlots.set('boots', 'slot.armor.feet')

export default defineComponent((context) => {
    context.name('class_pvp:armor')
    context.schema({
        type: 'object',
        additionalProperties: false,
        properties: {
            protection: {
                type: 'integer'
            }
        }
    })
    context.template(({ protection }, { create }) => {
        const components = {}

        components['minecraft:icon'] = 'chestplate'
        components['minecraft:wearable'] = {
            slot: 'slot.armor.chest',
            protection
        }
        components['minecraft:max_stack_size'] = 1


        create(
            components,
            'minecraft:item/components'
        )
    })
})

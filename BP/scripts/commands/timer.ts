import Command from './command'
import * as Bossbar from '../utils/bossbar'

export default class TimerCommand extends Command {
    public constructor() {
        super('timer', true)
    }

    public run(event) {
        if (Bossbar.getBossbarEntities())
            Bossbar.clearBossbars()
        else
            Bossbar.createBossbarEntity()
    }
}
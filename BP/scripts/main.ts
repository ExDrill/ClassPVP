import { world, Player } from '@minecraft/server'
import RoundManager from './gamemode/roundManager';
//import Team from './team'
//import { Color, randomColor, tagPrefix } from './gamemode/colors'

let round: RoundManager;

world.afterEvents.chatSend.subscribe((event) => {
    switch (event.message) {
        case 'ready': {
            event.sender.addTag('class_pvp:ready');
            break;
        }
        case 'unready': {
            if (!event.sender.hasTag('class_pvp:ready')) return;

            event.sender.removeTag('class_pvp:ready');
            break;
        }
        case 'start': {
            if (round) round.endRound();

            const readyPlayers = world.getAllPlayers().filter((player) =>
                player.hasTag('class_pvp:ready'));

            round = new RoundManager()
            round.startRound()
            break;
        }
        /*
        case 'elim': {
            if (!round) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            const tag: string = event.sender.getTags().find((tag) =>
                tag.startsWith(tagPrefix));
            if (!tag) return;

            const targetColor: Color = Color[tag.substring(tagPrefix.length)];

            const team: Team = round.getTeamByColor(targetColor);
            if (!team) return;
            team.eliminate();

            event.sender.sendMessage(`${Color[targetColor]} team eliminated.`);
            break;
        }
        */
        case 'end': {
            if (!round) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            round.endRound()
            round = undefined;
            break;
        }
    }
})

// EVERYTHING COMMENTED IS BECAUSE IT'S NOT PORTED YET
/*
world.afterEvents.entityDie.subscribe((event) => {
    if (!round) return;
    if (!(event.deadEntity instanceof Player)) return;

    const player: Player = event.deadEntity as Player;
    const team: Team = round.getPlayerTeam(player);

    if (!team) return;

    player.addTag('class_pvp:eliminated');
    player.runCommand('gamemode spectator');
    // player.dimension.runCommand('')
})
*/
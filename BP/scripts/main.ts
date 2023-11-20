import { world, Player } from '@minecraft/server'
import Game from './gamemode/game';
import Team from './team'
import { Color, randomColor, tagPrefix } from './gamemode/colors'

let game: Game;

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
            if (game) game.end();

            const readyPlayers = world.getAllPlayers().filter((player) =>
                player.hasTag('class_pvp:ready'));

            game = new Game([new Team(randomColor(), readyPlayers, { x: 0, y: 0, z: 0 })]);
            game.start();
            break;
        }
        case 'elim': {
            if (!game) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            const tag: string = event.sender.getTags().find((tag) =>
                tag.startsWith(tagPrefix));
            if (!tag) return;

            const targetColor: Color = Color[tag.substring(tagPrefix.length)];

            const team: Team = game.getTeamByColor(targetColor);
            if (!team) return;
            team.eliminate();

            event.sender.sendMessage(`${Color[targetColor]} team eliminated.`);
            break;
        }
        case 'end': {
            if (!game) {
                event.sender.sendMessage('start a game to run this command');
                return;
            }

            game.end();
            game = undefined;
            break;
        }
    }
})

world.afterEvents.entityDie.subscribe((event) => {
    if (!game) return;
    if (!(event.deadEntity instanceof Player)) return;

    const player: Player = event.deadEntity as Player;
    const team: Team = game.getPlayerTeam(player);

    if (!team) return;

    player.addTag('class_pvp:eliminated');
    player.runCommand('gamemode spectator');
    // player.dimension.runCommand('')
})
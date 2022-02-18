import './style.css';
import { Game } from './ts/game';

const main = () => {
  const idContainer = 'container';
  const widthStage = 900;
  const heightStage = 600;
  const game = new Game(idContainer, widthStage, heightStage);
  game.initRender();
}
main()
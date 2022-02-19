import './style.css';
import { Game } from './ts/game';

const main = () => {
  const idContainer = 'container';
  const widthStage = window.innerWidth;
  const heightStage = window.innerHeight;
  const game = new Game(idContainer, widthStage, heightStage);
  game.initRender();
}
main()
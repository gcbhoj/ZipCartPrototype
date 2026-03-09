import { addIcons } from 'ionicons';
import {
  scan,
  arrowBack,
  thumbsUp,
  alert,
  thumbsDown,
  home,
  cart,
  person,
} from 'ionicons/icons';

//Organizing ion icons import to have a claen main.ts file
export function loadIcons() {
  addIcons({
    scan,
    arrowBack,
    thumbsUp,
    alert,
    thumbsDown,
    home,

    cart,
    person,
  });
}

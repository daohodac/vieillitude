import { Person } from './person';

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
 function shuffle<T>(array: T[]): T[] {
   // if it's 1 or 0 items, just return
   if (array.length <= 1) return array;

   // For each index in array
   for (let i = 0; i < array.length; i++) {

     // choose a random not-yet-placed item to place there
     // must be an item AFTER the current item, because the stuff
     // before has all already been placed
     const randomChoiceIndex = Math.floor(Math.random() * i);

     // place our random choice in the spot by swapping
     [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
   }

   return array;
 }

export const PERSONS: Person[] = shuffle([
  {familly: "Hodac",    name: 'Anne-Laure'},
  {familly: "Hodac",    name: 'Dao'},
  {familly: "Hodac",    name: 'Fanny'},
  {familly: "Hodac",    name: 'Paula'},
  {familly: "Hodac",    name: 'Lucie'},
  {familly: "Perrier", name: 'Gazouille'},
  {familly: "Perrier", name: 'Vero'},
  {familly: "Perrier", name: 'Mathilde'},
  {familly: "Perrier", name: 'Romain'},
  {familly: "Perrier", name: 'Julie'},
  {familly: "Brehault", name: 'Caro'},
  {familly: "Brehault", name: 'Gabriel'},
  {familly: "Brehault", name: 'Victor'},
  {familly: "Brehault", name: 'Capucine'},
  {familly: "Brehault", name: 'Barbichu'},
  {familly: "Lebreton", name: 'Etienne'},
  {familly: "Lebreton", name: 'Sophie'},
  {familly: "Lebreton", name: 'Pierre'},
  {familly: "Lebreton", name: 'Guillaume'},
  {familly: "Lebreton", name: 'Antoine' },
  {familly: "Bommensath", name: 'Bommen'},
  {familly: "Bommensath", name: 'Fab'},
  {familly: "Bommensath", name: 'Marie'},
  {familly: "Bommensath", name: 'Nathan'},
  {familly: "Andrieu", name: 'Agnes' },
  {familly: "Andrieu", name: 'Matthieu' },
  {familly: "Andrieu", name: 'Matisse' },
  {familly: "Andrieu", name: 'Simon' },
  {familly: "Andrieu", name: 'Elsa' },
  {familly: "Andrieu", name: 'Greg' },
  {familly: "Andrieu", name: 'Sophie' },
  {familly: "Andrieu", name: 'Zoe' },
  {familly: "Andrieu", name: 'Gabriel' },
  {familly: "Andrieu", name: 'Alice' },
]);

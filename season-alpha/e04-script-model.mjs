// Fictional, noncanonical script model used only by the local Season 1 Alpha.
// The marks establish paper revision order; they do not date either memory.
export const E04_ALPHA_PACK = Object.freeze({
  id:'e04-owner-script-model',
  revision:'versioned-records-photo-r1',
  cards:Object.freeze([
    Object.freeze({id:'station-route-copy',label:'MODEL · Town Records: station route board · Version 1',kind:'map'}),
    Object.freeze({id:'garden-route-update',label:'MODEL · Town Records: garden route update · Version 2',kind:'document'}),
    Object.freeze({id:'undated-way-photo',label:'MODEL · Undated photo: way sign',kind:'photo'})
  ]),
  clues:Object.freeze([
    Object.freeze({id:'version-mark',label:'MODEL clue · Compare the version marks',
      text:'The station route board says Version 1. The garden route update says Version 2. These marks order the papers; they do not date either memory or explain why the route changed.'})
  ]),
  relativeOrder:Object.freeze({earlier:'station-route-copy',later:'garden-route-update',basis:'version-mark'})
});

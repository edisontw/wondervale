import {mountE04Authoring} from '../e04/authoring-ui.mjs';

const pack={
  id:'e04-owner-script-model',
  revision:'versioned-records-photo-r1',
  cards:[
    {id:'station-route-copy',label:'MODEL · Town Records: station route board · Version 1',kind:'map'},
    {id:'garden-route-update',label:'MODEL · Town Records: garden route update · Version 2',kind:'document'},
    {id:'undated-way-photo',label:'MODEL · Undated photo: way sign',kind:'photo'}
  ],
  clues:[{id:'version-mark',label:'MODEL clue · Compare the version marks',text:'The station route board says Version 1. The garden route update says Version 2. These marks order the papers; they do not date either memory or explain why the route changed.'}],
  relativeOrder:{earlier:'station-route-copy',later:'garden-route-update',basis:'version-mark'}
};
const readJson=key=>{
  try{
    const value=localStorage.getItem(key);
    return value===null?null:JSON.parse(value);
  }catch{return null;}
};

mountE04Authoring(document.getElementById('e04-preview'),{
  pack,
  e02Save:readJson('wondervale-s01e02-progress-v1'),
  e03Save:readJson('wondervale-s01e03-progress-v1'),
  storage:localStorage,
  mode:'draft_preview'
});

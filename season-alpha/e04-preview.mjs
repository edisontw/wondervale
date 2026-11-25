import {mountE04Authoring} from '../e04/authoring-ui.mjs';

const pack={
  id:'season1-alpha-synthetic',
  revision:'local-model-r1',
  cards:[
    {id:'first-map',label:'MODEL · map A',kind:'map'},
    {id:'later-record',label:'MODEL · note B',kind:'document'},
    {id:'undated-photo',label:'MODEL · undated picture',kind:'photo'}
  ],
  clues:[{id:'revision-note',label:'MODEL clue',text:'In this fictional exercise only, note B mentions a revised copy of map A.'}],
  relativeOrder:{earlier:'first-map',later:'later-record',basis:'revision-note'}
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

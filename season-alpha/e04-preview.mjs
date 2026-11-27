import {mountE04Authoring} from '../e04/authoring-ui.mjs';
import {E04_ALPHA_PACK} from './e04-script-model.mjs';
import {ALPHA_HANDOFF_KEY,publishE04AlphaHandoff} from './e04-e05-handoff.mjs';
const readJson=key=>{
  try{
    const value=localStorage.getItem(key);
    return value===null?null:JSON.parse(value);
  }catch{return null;}
};

mountE04Authoring(document.getElementById('e04-preview'),{
  pack:E04_ALPHA_PACK,
  e02Save:readJson('wondervale-s01e02-progress-v1'),
  e03Save:readJson('wondervale-s01e03-progress-v1'),
  storage:localStorage,
  mode:'draft_preview',
  getAlphaHandoffHref:state=>{
    if(!state){
      try{localStorage.removeItem(ALPHA_HANDOFF_KEY);}catch{}
      return null;
    }
    const href=publishE04AlphaHandoff(state,localStorage);
    if(!href){try{localStorage.removeItem(ALPHA_HANDOFF_KEY);}catch{}}
    return href;
  }
});

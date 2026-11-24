// Fail-closed E10 PAPER provenance for the existing E11 spatial negotiation.
import {replay as replayE10} from '../authoring-labs/unnamed-story-model.mjs';
import {paperE10NeedsRevisit} from './e10-needs-revisit.mjs';
import {replayZones,addZoneEvent} from './two-needs-zones.mjs';
export function replayEarnedZones(source,events=[]) {
 try {const s=replayE10(source);if(!s||!paperE10NeedsRevisit(s))return null;
 return {...replayZones(events),canonicalEvents:[],rights:[],unlocks:[],northHillClosed:true,commonRevealed:false};}
 catch{return null;}
}
export function dispatchEarnedZones(source,events,event) {
 if(!replayEarnedZones(source,events))return null;
 try{const next=addZoneEvent(events,event);return replayEarnedZones(source,next)?next:null;}catch{return null;}
}
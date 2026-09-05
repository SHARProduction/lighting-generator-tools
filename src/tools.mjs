export const evaluators={
  'lighting-load-balancer': i=>{const limits=new Map((i.circuits||[]).map(x=>[x.id,Number(x.maxWatts)])),loads={};for(const f of i.fixtures||[])loads[f.circuit]=(loads[f.circuit]||0)+Number(f.watts);const rows=[...limits].map(([id,maxWatts])=>({id,maxWatts,loadWatts:loads[id]||0,overloaded:(loads[id]||0)>maxWatts}));return{valid:rows.length>0&&!rows.some(x=>x.overloaded)&&(i.fixtures||[]).every(x=>limits.has(x.circuit)),rows}},
  'generator-fuel-estimator': i=>{const h=Number(i.runtimeHours),load=Number(i.loadPercent)/100,full=Number(i.litersPerHourAtFullLoad),idle=Number(i.idleFactor),reserve=Number(i.reservePercent)/100,rate=full*(idle+(1-idle)*load),liters=rate*h*(1+reserve);return{valid:h>0&&load>=0&&load<=1&&full>0,litersPerHour:+rate.toFixed(2),litersWithReserve:+liters.toFixed(2)}}
};
export function evaluate(slug,input){const fn=evaluators[slug];if(!fn)throw new Error('Unknown tool');return fn(input)}

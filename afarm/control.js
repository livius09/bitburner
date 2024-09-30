control.js

/** @param {NS} ns */
export async function main(ns) {
  let targ = ns.args[0];
  while (true) {
    //get the security and money
    let minsec = ns.getServerMinSecurityLevel(targ);
    let seclev = ns.getServerSecurityLevel(targ);
    let maxmon = ns.getServerMaxMoney(targ);
    let curmon = ns.getServerMoneyAvailable(targ);
    //get the times 
    let thack = ns.getHackTime(targ);
    let tgrow = ns.getGrowTime(targ);
    let tweak = ns.getWeakenTime(targ);
    //get max threads
    let  free= ns.getServerMaxRam(targ)-ns.getServerUsedRam(targ);
    let mthhack=Math.floor(free/ns.getScriptRam("hack.js"));
    let mthweak=Math.floor(free/ns.getScriptRam("weaken.js"));
    let mthgrow=Math.floor(free/ns.getScriptRam("grow.js"));
    

    if (seclev > minsec + 0.5) {
      ns.run("weaken.js",mthweak,targ);
      await ns.sleep(tweak);
    } else if (curmon < maxmon/3) {
      ns.run("grow.js",mthgrow,targ);
      await ns.sleep(tgrow);
    } else {
      ns.run("hack.js",mthhack,targ);
      await ns.sleep(thack);
    }
    await ns.sleep(100);
  }
}

/** @param {NS} ns */
export async function main(ns) {
  let targ = ns.args[0];
  if (ns.getServerMaxMoney(targ) == 0) {
    throw ("server " + targ + " has no money");
  }
  while (true) {
    // get the security and money
    let minsec = ns.getServerMinSecurityLevel(targ);
    let seclev = ns.getServerSecurityLevel(targ);
    let maxmon = ns.getServerMaxMoney(targ);
    let curmon = ns.getServerMoneyAvailable(targ);

    // get the times
    let thack = ns.getHackTime(targ);
    let tgrow = ns.getGrowTime(targ);
    let tweak = ns.getWeakenTime(targ);
    // get max threads
    let free = ns.getServerMaxRam(targ) - ns.getServerUsedRam(targ);
    let mthhack = Math.floor(free / ns.getScriptRam("hack.js"));
    let mthweak = Math.floor(free / ns.getScriptRam("weaken.js"));
    let mthgrow = Math.floor(free / ns.getScriptRam("grow.js"));

    if (seclev > minsec + 0.5 && mthweak != 0 && !ns.scriptRunning("weaken.js", targ)) {
      ns.run("weaken.js", mthweak, targ);
      await ns.sleep(tweak);
    } else if (curmon < maxmon * 0.5 && mthgrow != 0 && !ns.scriptRunning("grow.js", targ)) {
      ns.run("grow.js", mthgrow, targ);
      ns.run("grow.js", mthgrow, targ);
      await ns.sleep(tgrow);
    } else if (mthhack != 0 && !ns.scriptRunning("hack.js", targ)) {
      ns.run("hack.js", mthhack, targ);
      await ns.sleep(thack);
    } else {
      await ns.sleep(2000);
    }
    await ns.sleep(100);
  }
}

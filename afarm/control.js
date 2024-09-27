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

    if (seclev < minsec + 5) {
      ns.print("Runing Weaken");
      ns.run("weaken.js");
      await ns.sleep(thack + 100);
    } else if (curmon < maxmon * 0.5) {
      ns.print("Runing Grow");
      ns.run("grow.js");
      await ns.sleep(tgrow + 100)
    } else {
      ns.print("Runing Hack");
      ns.run("hack.js");
      await ns.sleep(thack + 100);
    }

  }
}

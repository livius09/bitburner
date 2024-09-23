/** @param {NS} ns */
export async function main(ns) {
  var targ = ns.args[0];
  while (true) {
    if ((ns.getServerMinSecurityLevel(targ) + 5) < ns.getServerSecurityLevel(targ)) {
      await ns.weaken(targ);
    } else if (ns.getServerMoneyAvailable(targ) < ns.getServerMaxMoney(targ) / 3) {
      await ns.grow(targ);
    } else {
      await ns.hack(targ);
    }
  }
}

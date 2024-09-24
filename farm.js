/** @param {NS} ns */
export async function main(ns) {
  var targ = ns.args[0]; //get the target from the argument 
  while (true) {
    if ((ns.getServerMinSecurityLevel(targ) + 5) < ns.getServerSecurityLevel(targ)) { //if the security isnt min whit a toleranz of 5
      await ns.weaken(targ); //weaken the security 
    } else if (ns.getServerMoneyAvailable(targ) < ns.getServerMaxMoney(targ) / 3) { //if the money isnt one thrird of the max 
      await ns.grow(targ);//increas the money on the server
    } else { //if every thing is allright 
      await ns.hack(targ);//get money from the server
    }
  }
}

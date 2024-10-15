export async function main(ns) {
  var maxno = 25;//max nodes
  var maxle = 150;//max level of each node
  var maxram = 32; //max GB ram
  var maxcor = 15;

  while (true) {
    let chan = 0;//changes made
    let nodes = ns.hacknet.numNodes();

    if (ns.hacknet.getPurchaseNodeCost() < (ns.getServerMoneyAvailable("home") - 1000) && nodes < maxno) { //if you can aford it and if not over maxno
      ns.tprint("bought " + ns.hacknet.purchaseNode())//purchase and print its index
      continue;//if it bought something restart the while loop
    }

    for (let i = 0; i < nodes; i++) {//for each node 
      if (ns.hacknet.getNodeStats(i).level < maxle && ns.hacknet.getLevelUpgradeCost(i) < ns.getServerMoneyAvailable("home") - 1000) {
        ns.hacknet.upgradeLevel(i, 1);//Purchase a level upgrade for the node i 
        ns.tprint("upgraded level of " + i)
        chan += 1;
      }
    }

    for (let j = 0; j < nodes; j++) {//for each node 
      if (ns.hacknet.getNodeStats(j).ram < maxram && ns.hacknet.getRamUpgradeCost(j) < ns.getServerMoneyAvailable("home") - 1000) {
        ns.hacknet.upgradeRam(j, 1);//Purchase a ram upgrade for the node i 
        ns.tprint("upgraded ram of " + j)
        chan += 1;
      }
    }
    for (let u = 0; u < nodes; u++) {
      if (ns.hacknet.getNodeStats(u).cores < maxcor && ns.hacknet.getCoreUpgradeCost(u) < ns.getServerMoneyAvailable("home") - 100) {
        ns.hacknet.upgradeCore(u, 1);
        ns.tprint("upgraded cores of " + u);
        chan += 1
      }
    }

    if (chan == 0) { break; }
  }
}

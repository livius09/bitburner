/** @param {NS} ns */
export async function main(ns) {
  var maxno = 20;//max nodes
  var maxle = 100;//max level of each node

  while (true) {
    let chan = 0;//changes made
    let nodes = ns.hacknet.numNodes();
    
    if (ns.hacknet.getPurchaseNodeCost() < (ns.getServerMoneyAvailable("home") - 1000) && nodes < maxno) { //if you can aford it and if not over maxno
      ns.tprint("bought "+ns.hacknet.purchaseNode())//purchase and print its index
      continue;//if it bought something restart the while loop
    }

    for (let i = 0; i < nodes; i++) {//for each node 
      if (ns.hacknet.getNodeStats(i).level <= maxle && ns.hacknet.getLevelUpgradeCost(i) < ns.getServerMoneyAvailable("home")-1000) {
        ns.hacknet.upgradeLevel(i,1);//Purchase a level upgrade for the node i 
        ns.tprint("upgraded level of "+i)
        chan += 1 
      }
    }
    if (chan==0) {break;}
  }
}

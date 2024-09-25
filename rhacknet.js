/** @param {NS} ns */
export async function main(ns) {
  while (true){
    ns.run("hacknet.js");
    await ns.sleep(30000);
  }
}

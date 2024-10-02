/** @param {NS} ns */
export async function main(ns) {
  let ten = ns.getPortHandle(10);
  let rea = null;
  while (true) {
    if (!ten.empty()) {
      let rea = (ten.read())
      if (rea == 10) {
        ns.run("weaken.js", 1, ns.getHostname());
      }
      ns.tprint(rea);
    }
    await ns.sleep(1000);
  }
}

ho_spread.js

/** @param {NS} ns */
export async function main(ns) {
  var ar = ns.scan("home");  // Start by scanning from 'home'

  while (true) {
    let chan = 0;  // Track if any new servers are found in this loop

    for (let i = 0; i < ar.length; i++) {
      let server = ar[i];  // Existing server in the list
      let sca = ns.scan(server);  // Scan the connected servers to this one

      for (let j = 0; j < sca.length; j++) {  // Loop through newly scanned servers
        let newServer = sca[j];

        // Add the newly discovered server if it's not already in the list
        if (!ar.includes(newServer)) {
          ar.push(newServer);
          chan += 1;  // Mark that a change was made
        }
      }
    }
    // If no new servers were found, break out of the loop
    if (chan == 0) {
      break;
    }
  }
  async function stfarm(ns, server) {
    await ns.nuke(server);
    ns.tprint("infected " + server);
    ns.exec("farm.js", server, 1, server);
  }

  for (let a = 0; a < ar.length; a++) {
    let server = ar[a];
    if (!ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel) {
      switch (ns.getServerNumPortsRequired(server)) {
        case 0:
          await stfarm(ns, server);
          await ns.scp("farm.js", server);
          break;
        case 1:
          if (ns.fileExists("BruteSSH.exe")){
            await ns.brutessh(server);
            await ns.scp("farm.js", server);
            await stfarm(ns, server);
          }else{
            ns.tprint("you dont have the programs to crack 1 port");
          }
          break;
        case 2:
          if (ns.fileExists("BruteSSH.exe")&&ns.fileExists("FTPCrack.exe")){
            await ns.brutessh(server);
            await ns.ftpcrack(server);
            await ns.scp("farm.js", server);
            await stfarm(ns, server);
          }else{
            ns.tprint("you dont have the programs to crack 2 ports");
          }
        
        default:
          break;
      }
    }
  }
}

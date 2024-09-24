/** @param {NS} ns */
export async function main(ns) {
  var sca = ns.scan("home");  // Get list of servers connected to "home"
  var ar = [];
  
  // Loop through the scanned servers
  for (let i = 0; i < sca.length; i++) {
    let server = sca[i];
    // Check if the server requires 0 port and doesn't have root access
    if (ns.getServerNumPortsRequired(server) == 0 && ns.hasRootAccess(server) == false) {
      ar.push(server);  // Add the server to the array
    }
  }
  
  // Loop through the array of servers without root access
  for (let i = 0; i < ar.length; i++) {
    let server = ar[i];
    await ns.nuke(server);  // Gain root access
    await ns.scp("farm.js", server);  // Copy farm.js to the server
    ns.exec("farm.js", server, 1, server);  // Run farm.js with 1 thread, passing the server name as an argument
  }
}

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
  
  // Print the final list of all discovered servers
  ns.tprint(ar);
}

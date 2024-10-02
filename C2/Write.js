/** @param {NS} ns */
export async function main(ns) {
  let server = ns.args[0];
  let mesg = ns.args[1];
  if(ns.serverExists(server)){
  ns.exec("reciv.js",server,1,mesg);
  }else{
    throw("eror server does not exist")
  }
}

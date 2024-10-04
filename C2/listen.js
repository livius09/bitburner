export async function main(ns) {
  function eror(ns){
    ns.tprint("system eror");
    ns.kill(ns.pid);
  }

  let ten = ns.getPortHandle(10);
  let authl = 10;
  if (ns.fileExists("user.txt")){
    let userstxt = ns.read("user.txt")
    var users=userstxt.split(",");
  }else{
    eror(ns);
  }

  if (ns.fileExists("psw.txt")){
  let pswtxt = ns.read("psw.txt");
  var psw=pswtxt.split(",");
  }else{
    eror(ns);
  }
  
  if (ns.fileExists("auth.txt")){
  let authtxt =read("auth.txt");
  var authlev = authtxt.split(",");
  }else{
    eror(ns)
  }
  
  let id = -1; // Declare id outside

  while (true) {
    if (!ten.empty()) {
      let message = ten.read();
      if (message == "login") {
        // Username check
        while (true) {
          let unamein = await ns.prompt("Enter user Name: ", { type: "text" });
          if (users.includes(unamein)) {
            id = users.indexOf(unamein);
            break;
          }
          ns.tprint("User does not exist!");
        }

        // Password check
        let upas = await ns.prompt("Enter password: ", { type: "text" });
        if (upas === psw[id]) {
          authl = authlev[id];
          ns.tprint("Welcome " + users[id]);
          break;  // Break out of login loop
        } else {
          ns.tprint("Wrong password, please try again.");
        }
      } else {
        ns.tprint("You have to login first.");
      }
    }
    await ns.sleep(500);
  }

  // After successful login, handle commands
  while (true) {
    if (!ten.empty()) {
      let rea = ten.read();

      if (rea === 10) {
        ns.run("weaken.js", 1, ns.getHostname());
      }
      if (rea=="reboot"){
        ns.run("listen.js");
        ns.tprint("rebooted");
        ns.kill(ns.pid);
      }
      ns.tprint(rea);
    }
    await ns.sleep(1000);
  }
}

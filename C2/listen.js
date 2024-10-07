/** @param {NS} ns */
export async function main(ns) {
  
  let ten = ns.getPortHandle(10);

  function eror(ns) {
    ns.tprint("system eror");
    ns.kill(ns.pid);
  }
  async function awinput(ns){
    while (true){
      if (!ten.empty()){
        return ten.read();
        break;
      }
      await ns.sleep(100);
    }
  }

  if (ns.fileExists("user.txt")) {
    let userstxt = ns.read("user.txt")
    var users = userstxt.split(",");
  } else {
    eror(ns);
  }

  if (ns.fileExists("psw.txt")) {
    let pswtxt = ns.read("psw.txt");
    var psw = pswtxt.split(",");
  } else {
    eror(ns);
  }

  if (ns.fileExists("auth.txt")) {
    let authtxt = ns.read("auth.txt");
    var authl = authtxt.split(",");
  } else {
    eror(ns)
  }

  let id = -1; // Declare id outside

  while (true) {
    if (!ten.empty()) {
      let message = ten.read();
      if (message == "login") {
        // Username check
        while (true) {
          ns.tprint("Please enter your user Name")
          let unamein = await awinput(ns);
          if (users.includes(unamein)) {
            id = users.indexOf(unamein);
            break;
          }
          ns.tprint("User does not exist!");
        }

        // Password check
        ns.tprint("Please enter your Pasword")
        let upas = await awinput(ns);
        if (upas === psw[id]) {
          var authlev = authl[id];
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
      if (rea == "reboot") {
        ns.run("listen.js");
        ns.tprint("rebooted");
        ns.kill(ns.pid);
      }
      if (rea == "add user") {
        if (authlev < 1) {
          while (true) {
            let aduser = await ns.prompt("name of user to add", { type: "text" });
            if (!users.includes(aduser)) {
              ns.write("user.txt", ","+aduser, "a");
              break;
            } else {
              ns.tprint("user already exists chose a other name");
            }
          }
          let addpas = await ns.prompt("chose a pasword for user", { type: "text" });
          ns.write("psw.txt", "," + addpas, "a");

          let addauth = await ns.prompt("chose auth level for new user", { type: "text" });
          ns.write("auth.txt", "," + addauth, "a");

          ns.tprint("finished seting up user you can log in after reboot");

        } else {
          ns.tprint("you dont have the authlevel to add users. 0 or lower is requierd");
        }
      }
      ns.tprint(rea)
    }
    await ns.sleep(1000);
  }
}

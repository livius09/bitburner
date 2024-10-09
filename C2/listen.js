/** @param {NS} ns */
export async function main(ns) {

  let ten = ns.getPortHandle(10);

  function eror(ns) {
    ns.tprint("system eror");
    ns.kill(ns.pid);
  }

  function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      let charCode = input.charCodeAt(i); // Get the Unicode value of each character
      hash = (hash << 5) - hash + charCode; // Shift and add the character code
      hash = hash & hash; // Convert to a 32-bit integer (like a hash overflow simulation)
    }
    return hash >>> 0; // Return an unsigned 32-bit integer
  }

  async function awinput(ns) {
    while (true) {
      if (!ten.empty()) {
        return ten.read();
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
    var authl = authtxt.split(",").map(Number);
  } else {
    eror(ns);
  }
  if (!(users.length == psw.length && psw.length == authl.length && users.length == authl.length)) {
    eror(ns);
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
        if (simpleHash(upas) == psw[id]) {
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
            ns.tprint("Please enter the name of the user to add: ");
            let aduser = await awinput(ns);
            if (!users.includes(aduser)) {
              if (!aduser.includes(",")) {
                ns.write("user.txt", "," + aduser, "a");
                break;
              } else {
                ns.tprint("you cant have a , in user name");
                continue;
              }

            } else {
              ns.tprint("user already exists chose a other name");
            }
          }
          while (true) {
            ns.tprint("chose a pasword for the user: ");
            let addpas = await awinput(ns);
            if (!addpas.includes(",")) {
              ns.write("psw.txt", "," + simpleHash(addpas), "a");
              break;
            } else {
              ns.tprint("You cant have a , in a password");
            }
          }
          while (true) {
            ns.tprint("Chose an autlevel for the user(must be a number)");
            var addauth = Number(await awinput(ns));
            if (!isNaN(addauth)) {
              ns.write("auth.txt", "," + addauth, "a");
              break;
            } else {
              ns.tprint("auth level has to be a number");
            }
          }

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

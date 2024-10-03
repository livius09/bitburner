export async function main(ns) {
  let ten = ns.getPortHandle(10);
  let authl = 10;
  let users = ["levi", "mike"];
  let psw = ["levi", "okslong"];
  let authlev = [0, 1];
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
      ns.tprint(rea);
    }
    await ns.sleep(1000);
  }
}

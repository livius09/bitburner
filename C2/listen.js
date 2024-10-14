/** @param {NS} ns */
export async function main(ns) {

  ns.disableLog("sleep");

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
  async function rmuser(ns) {
    ns.tprint("which user do you want to delet: ")
    let rmus = await awinput(ns);
    if (authlev < 1) {
      if (users.includes(rmus)) {
        if (curuser != rmus) {
          ns.tprint("are you shure you want to delet user " + rmus + " yes/no");
          if (await awinput(ns) === "yes") {
            let index = users.indexOf(rmus);
            users.splice(index, 1);
            psw.splice(index, 1);
            authl.splice(index, 1);

            ns.write("user.txt", users.toString(), "w");
            ns.print("removed from users")
            ns.write("psw.txt", psw.toString(), "w");
            ns.print("removed from psw" )
            ns.write("auth.txt", authl.toString(), "w");

            ns.tprint("removed user " + rmus)

          } else {
            ns.tprint("ok dann halt nicht")
          }
        } else {
          ns.tprint("you cant delet yourself");
        }
      } else {
        ns.tprint("user doese not exist");
      }
    } else {
      ns.tprint("you dont have the authlevel to do that")
    }
  }
  async function adduser(ns){
    if (authlev < 1) {
        while (true) {
            ns.tprint("Please enter the name of the user to add: ");
            var aduser = await awinput(ns);
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
          ns.print("set up an new user: "+aduser)
          ns.tprint("finished seting up user you can log in after reboot");

        } else {
          ns.tprint("you dont have the authlevel to add users. 0 or lower is requierd");
        }
    
  }
  if (ns.fileExists("user.txt")) {
    let userstxt = ns.read("user.txt")
    var users = userstxt.split(",");
    ns.print("users imported")
  } else {
    eror(ns);
  }

  if (ns.fileExists("psw.txt")) {
    let pswtxt = ns.read("psw.txt");
    var psw = pswtxt.split(",");
    ns.print("paswords imported");
  } else {
    eror(ns);
  }

  if (ns.fileExists("auth.txt")) {
    let authtxt = ns.read("auth.txt");
    var authl = authtxt.split(",").map(Number);
    ns.print("autl inported");
  } else {
    eror(ns);
  }
  if (!(users.length == psw.length && psw.length == authl.length && users.length == authl.length)) {
    eror(ns);
  }else{
    ns.print("all files are the same length")
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
            ns.print("enterd user name: " + unamein)
            break;
          }
          ns.tprint("User does not exist!");
          ns.print("failed to usernam whit: " + unamein)
        }

        // Password check
        ns.tprint("Please enter your Pasword")
        let upas = await awinput(ns);
        if (simpleHash(upas) == psw[id]) {
          var authlev = authl[id];
          var curuser = users[id];
          ns.tprint("Welcome " + curuser);
          ns.print(curuser+" loged in");
          break;  // Break out of login loop
        } else {
          ns.tprint("Wrong password, please try again.");
          ns.print("tried wrong pasword for "+users[id]);
        }
      } else {
        ns.tprint("You have to login first.");
        ns.print("enterd" + message + "whitout being loged in")
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
        await adduser(ns);
        
      }
      if (rea == "remove user") {
        await rmuser(ns);
      }

      ns.tprint(rea);
      ns.print(rea);
    }
    await ns.sleep(1000);
  }
}

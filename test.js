// Modules
const fs = require("fs");

// Files
const Crud = require("./Auth/crud.js");
const eCrud = require("./Auth/functions.js");

// console.log(Crud.User("795000467301203972"))

// console.log(eCrud.isPremium("795000467301203972"))

// console.log(eCrud.isAdmin("795000467301203972"));

// console.log(eCrud.Userstats("795000467301203972"));

console.log(eCrud.MemberCount());

console.log(eCrud.PremiumCount());

console.log(eCrud.isRegistered("795000467301203972"))
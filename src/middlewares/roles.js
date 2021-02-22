const AccessControl = require('accesscontrol');



exports.roles = (function(){
const ac = new AccessControl();
ac.grant = ('student')
.readOwn("profile")
.updateOwn("profile")


ac.grant("tutor")
.readOwn("profile")
.updateOwn("profile")

ac.grant("admin")
.extend("student")
.extend("tutor")
.readAny("profile")
.updateAny("profile")
.delete("profile")

return ac;
})();
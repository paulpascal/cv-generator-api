function CognitoUser() {
  this.confirmRegistration = (code, bool, cb) => {
    process.nextTick(cb(null, 'confirmed'));
  };
}
module.exports = CognitoUser;

function CognitoUserPool(data) {
  const { UserPoolId, ClientId } = data;
  this.userPoolId = UserPoolId;
  this.clientId = ClientId;
  this.getCurrentUser = jest.fn().mockReturnValue('cognitouserpool');
  this.signUp = jest.fn().mockReturnValue(true);
}
module.exports = CognitoUserPool;

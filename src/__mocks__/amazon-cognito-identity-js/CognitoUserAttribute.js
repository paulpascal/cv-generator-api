function CognitoUserAttribute(data) {
  const { Name, Value } = data;
  this.Name = Name;
  this.Value = Value;
  this.getValue = jest
    .fn()
    .mockReturnValue({ Name: this.Name, Value: this.Value });
  this.getName = jest.fn().mockReturnValue('name');
  this.setName = jest.fn().mockReturnValue({ Name: 'email', Value: 'email' });
  this.toString = jest.fn().mockReturnValue('name to string');
  this.toJSON = jest.fn().mockReturnValue({});
}
module.exports = CognitoUserAttribute;

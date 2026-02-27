class RegistrationResponseModel {
  constructor(userId, userName, message) {
    ((this.userId = userId),
      (this.userName = userName),
      (this.message = message));
  }
}

export default RegistrationResponseModel;

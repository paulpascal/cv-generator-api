import { Inject, Injectable } from '@nestjs/common';
import { AuthConfig } from './auth.config';
import { AuthConfirmationInput, AuthConfirmationOutput } from './dtos/confirm-signup.dto';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { AuthRegisterInput, AuthRegisterOutput } from './dtos/register.dto';
import { AuthenticateInput, AuthenticateOutput } from './dtos/authenticate.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserInput } from 'src/user/dtos/create-user.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject('AuthConfig')
    private readonly authConfig: AuthConfig,
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.authConfig.userPoolId,
      ClientId: this.authConfig.clientId,
    });
  }

  get secretKey() {
    return this.authConfig.secret;
  }

  async cognitoRegister(userPool: CognitoUserPool, {name, password, email}:AuthRegisterInput): Promise<ISignUpResult>{
     return new Promise((resolve, reject) => {
      return userPool.signUp(
        name,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result);
          }
        },
      );
    });
  }

  async register(authRegisterRequest: AuthRegisterInput): Promise<AuthRegisterOutput> {
    try{
      const registerUserRequest = await this.cognitoRegister(this.userPool, authRegisterRequest)
      const userData: CreateUserInput ={email:authRegisterRequest.email, userId: registerUserRequest.userSub} 
      const userCreation = await this.userService.createUser(userData)
      return userCreation
    }catch{
      return {ok: false, error: "Cannot create account"}
    }
  }

  async authenticateUser(user: AuthenticateInput): Promise<AuthenticateOutput> {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({ok: true, token: result.getIdToken().getJwtToken(), userId: result.getIdToken()?.payload?.sub });
        },
        onFailure: (err) => {
          reject({ok: false, error: err.message});
        },
      });
    });
  }

  async verifyEmail(authConfirmSignupDto: AuthConfirmationInput):Promise<AuthConfirmationOutput> {
    const { email, code } = authConfirmSignupDto;
    const userData = {
      Username: email,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, true, (err, res) => {
        if (err) {
          reject({ok: false, error: err.message});
        }
        resolve({ok:true});
      });
    });
  }
}

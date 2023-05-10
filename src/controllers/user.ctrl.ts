import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { v4 } from "uuid";

import UserData from "../data/users.json";
import { Registration, User } from "../models";
import { AuthenticationError, LoginSchema, RegisterSchema } from "../utils/user";

const TOKEN_KEY = "MxB95uS$f5Z@bt7jtf89";

class UserService {

  private _users: User[];

  constructor() {
    this._users = UserData as User[];
  }

  public register = async (user: User): Promise<User> => {
    let validatedUserData: Registration;
    try {
      validatedUserData = await RegisterSchema.validate(user, {abortEarly: false}) as Registration;
    } catch (err) {
      throw new AuthenticationError("Invalid user data", 400, err);
    }

    const existing = this._users.find((user) => user.email === validatedUserData.email);
    if (existing) {
      throw new AuthenticationError("Invalid user data", 400);
    }

    const newUser: User = {
      ...validatedUserData,
      userId: v4(),
      password: await hash(user.password, 10)
    };
    this._users.push(newUser);

    return newUser;
  };
  
  public login = async (username: string, password: string): Promise<string> => {
    let credentials: { username?: string, password?: string };
    try {
      credentials = await LoginSchema.validate({
          username,
          password,
      }, {
        abortEarly: false
      }) as typeof credentials;
    } catch (error) {
      throw new AuthenticationError("Invalid username or password", 400, error);
    }

    const user = this._users.find((user) => user.email === credentials.username);
    const isValidPass = user && await compare(credentials.password, user.password);
    if (!user || !isValidPass) {
      throw new AuthenticationError("Invalid username or password", 401);
    }

    const {
      userId,
      email,
      firstName,
      lastName
    } = user;
    return sign(
      {userId, email, firstName, lastName},
      TOKEN_KEY,
      { expiresIn: "2h" }
    );
  }

  public verifyToken = (authToken?: string): User => {
    if (!authToken) {
      throw new AuthenticationError("A token is required", 403);
    }
    try {
      const decoded = verify(authToken.replace("Bearer ", ""), TOKEN_KEY) as User;
      return this._users.find((user) => user.userId === decoded.userId);
    } catch (error) {
      throw new AuthenticationError("Invalid token", 401);
    }
  }

  public get users() {
    return this._users.map(user => {
      const { password, ...userData } = user;
      return userData;
    });
  }

}

const users = new UserService();
export default users;
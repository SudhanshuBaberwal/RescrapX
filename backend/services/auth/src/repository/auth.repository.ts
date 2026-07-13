import User, { IUser } from "../models/user.model.js";

class AuthRepository {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async createUser(user: Partial<IUser>) {
    return await User.create(user);
  }
}

export default new AuthRepository();
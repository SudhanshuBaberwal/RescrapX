import User, { IUser, UserRole } from "../models/user.model.js";

class AuthRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findByEmailWithPassword(email: string) {
    return User.findOne({ email }).select("+password");
  }

  async createUser(user: Partial<IUser>) {
    return User.create(user);
  }

  async findById(userId: string) {
    return User.findById(userId);
  }

  async save(user: IUser) {
    return user.save();
  }

  async findByIdWithPassword(userId: string) {
    return User.findById(userId).select("+password");
  }

  async findByGoogleId(googleId: string) {
    return User.findOne({
      googleId,
    });
  }

  async createPartner(data: Partial<IUser>) {
    return await User.create(data);
  }

  async findByIdAndUpdate(userId: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });
  }

  async findAdmin() {
  return User.findOne({
    role: UserRole.ADMIN,
  });
}
}

export default new AuthRepository();

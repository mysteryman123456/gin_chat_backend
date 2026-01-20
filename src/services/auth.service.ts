import { UserRepository } from "../repositories/user.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { SingupData, LoginData } from "../dtos/user.dto";
import { JwtUtil } from "../utils/jwt";
import { HashUtil } from "../utils/hash";
import { HttpError } from "../utils/http_error";

export class AuthService {
  private userRepo = new UserRepository();
  private authRepo = new AuthRepository();

  async signup(data: SingupData) {
    const existingUser = await this.userRepo.getUserByEmail(data.email);
    if (existingUser) throw new HttpError("User already exists", 400);
    const hashedPassword = await HashUtil.hash(data.password);

    const user = await this.authRepo.createUser({
      username: data.username,
      email: data.email,
      password: hashedPassword,
    });
    return user;
  }

  async login(data: LoginData) {
    const user = await this.authRepo.loginUser(data.email);
    if (!user) throw new HttpError("Invalid email or password", 400);

    if (user.isBlocked) throw new HttpError("User is blocked", 400);

    const isPasswordValid = await HashUtil.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) throw new HttpError("Invalid email or password", 400);

    const token = JwtUtil.generateToken({
      profile_image: user.profile_image ?? null,
      username: user.username,
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return {
      token,
      _id: user._id,
      email: user.email,
      username: user.username,
      password: user.password,
    };
  }
}

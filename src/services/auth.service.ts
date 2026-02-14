import { UserRepository } from "../repositories/user.repository";
import { AuthRepository } from "../repositories/auth.repository";
import { SingupData, LoginData } from "../dtos/user.dto";
import { JwtUtil } from "../utils/jwt";
import { HashUtil } from "../utils/hash";
import { HttpError } from "../utils/http_error";
import { generateOtp } from "../utils/otpGenerate";
import { emailService } from "./email.service";
import bcrypt from "bcryptjs";

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

    if (user.is_blocked) throw new HttpError("User is blocked", 400);

    const isPasswordValid = await HashUtil.compare(
      data.password,
      user.password
    );

    if (!isPasswordValid) throw new HttpError("Invalid email or password", 400);

    const token = JwtUtil.generateToken({
      profile_image: user.profile_image ?? null,
      username: user.username,
      email: user.email,
      _id: user._id,
      role: user.role,
    });

    return {
      token,
      _id: user._id,
      email: user.email,
      username: user.username,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.getUserByEmail(email);

    if (!user) return null;

    const otp = generateOtp(6);
    const expires = new Date(Date.now() + 3 * 60 * 1000);

    await this.authRepo.setOtp(email, otp, expires);

    await emailService.sendEmail(
      email,
      "Password Reset OTP",
      `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 3 minutes.</p>
      `
    );

    const token = JwtUtil.generateToken({ email }, "3m");

    return token;
  }

  async resetPassword(token: string, otp: string, newPassword: string) {
    let email: string;

    try {
      const decoded = JwtUtil.verifyToken(token);
      email = decoded.email;
    } catch {
      throw new HttpError("Invalid or expired token", 400);
    }

    const user = await this.userRepo.getUserByEmail(email);

    if (!user) {
      throw new HttpError("Invalid token", 400);
    }

    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otp_expires ||
      user.otp_expires < new Date()
    ) {
      throw new HttpError("Invalid or expired OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.authRepo.updatePasswordAndClearOtp(email, hashedPassword);

    return true;
  }
}

import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SignupSchema, LoginSchema } from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";
import { JwtUtil } from "../utils/jwt";

export class AuthController {
  private authService = new AuthService();

  signup = async (req: Request, res: Response) => {
    const validatedData = SignupSchema.safeParse(req.body);

    if (!validatedData.success)
      throw new HttpError(validatedData.error.issues[0].message, 400);
    const result = await this.authService.signup(validatedData.data);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: result,
    });
  };

  verifyToken = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new HttpError("Authentication token missing", 401);
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new HttpError("Invalid authorization format", 401);
    }
    const token = parts[1];
    const payload = JwtUtil.verifyToken(token);
    return res.status(200).json({
      success: true,
      message: "Token verified successfully",
      data: { payload },
    });
  };

  login = async (req: Request, res: Response) => {
    const validatedData = LoginSchema.safeParse(req.body);
    if (!validatedData.success)
      throw new HttpError(validatedData.error.issues[0].message, 400);
    const result = await this.authService.login(validatedData.data);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };

  forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) throw new HttpError("Email is required", 400);

    const token = await this.authService.forgotPassword(email);

    return res.json({
      success: true,
      message: "If email exists, OTP sent.",
      data: { token },
    });
  };

  resetPassword = async (req: Request, res: Response) => {
    const { password, otp } = req.body;
    const token = req.query.token as string;

    if (!token) throw new HttpError("Token missing", 400);
    await this.authService.resetPassword(token, otp, password);

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  };
}

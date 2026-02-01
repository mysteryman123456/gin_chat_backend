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
    const token = req.cookies.token;
    if (!token) throw new HttpError("Unauthorized", 401);
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
    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  };
}

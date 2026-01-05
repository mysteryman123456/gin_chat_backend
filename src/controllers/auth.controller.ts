import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SignupSchema, LoginSchema } from "../dtos/user.dto";
import { HttpError } from "../utils/http_error";

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
}

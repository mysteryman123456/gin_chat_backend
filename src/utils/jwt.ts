import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "../types/user";

export class JwtUtil {
  static generateToken(
    payload: object,
    jwt_time: string | number = "7d"
  ): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: jwt_time,
    } as SignOptions);
  }

  static verifyToken(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload as JwtPayload;
  }
}

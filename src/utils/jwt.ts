import jwt from "jsonwebtoken";

export class JwtUtil {
  static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
  }
  static verifyToken(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return payload;
  }
}

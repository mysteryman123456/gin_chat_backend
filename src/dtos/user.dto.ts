import z from "zod";

export const GeneralUserScehema = z.object({
  username: z.string("Username is required").min(3, "Username is reuired"),
  email: z
    .email({ error: "Please provide a valid email" })
    .min(2, "Email is required"),
  password: z
    .string("Password is required")
    .regex(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/,
      "Password must be 8-20 chars with at least one number and a special char"
    ),
  profile_image: z
    .string()
    .min(10, "Profile image url is required")
    .optional()
    .nullable(),
});
export type GeneralUserDataType = z.infer<typeof GeneralUserScehema>;

export const SignupSchema = GeneralUserScehema.pick({
  username: true,
  email: true,
}).extend({
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});
export type SingupData = z.infer<typeof SignupSchema>;

export const LoginSchema = GeneralUserScehema.pick({
  email: true,
  password: true,
});
export type LoginData = z.infer<typeof LoginSchema>;

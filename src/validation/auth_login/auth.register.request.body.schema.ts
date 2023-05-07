import { emailSchema } from '../common/email.schema';
import { loginSchema } from '../common/login.schema';
import { passwordSchema } from '../common/password.schema';

export const authRegisterRequestBodySchema = [
  emailSchema,
  loginSchema,
  passwordSchema,
];

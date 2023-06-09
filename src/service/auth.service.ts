import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { IEmailConfirmByUserDb } from '../db/db.types';
import { emailManager } from '../managers/email.managers';
import { userRepo } from '../repositories/users/user.repo';
import { userQueryRepo } from '../repositories/users/user.query.repo';

export const authService = {
  sendEmail: async (email: string, code: string): Promise<true | null> => {
    const resultMessage = await emailManager.sendEmailMessage(email, code);

    if (!resultMessage) return null; // message not sent

    return true;
  },

  emailConfirmationByUser: async (userId: string): Promise<string | null> => {
    const emailConfirmation: IEmailConfirmByUserDb = {
      userId,
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { minutes: 2 }),
      isConfirm: false,
    };

    const result = await userRepo.emailConfirmationByUser(emailConfirmation);

    if (!result) return null; // emailConfirmation failed

    return emailConfirmation.confirmationCode;
  },

  checkConfirmEmail: async (code: string): Promise<true | null> => {
    const result = await userQueryRepo.getEmailConfirmationCode(code);

    if (!result) return null; //codes not match

    if (result.isConfirm === true) return null; // user has already been verified

    if (result.expirationDate < new Date()) {
      await userRepo.deleteEmailConfirmByUser(result._id.toString());
      return null; // expirationDate limit exhausted
    }

    return await userRepo.updateEmailConfirmStatus(result._id.toString());
  },
};

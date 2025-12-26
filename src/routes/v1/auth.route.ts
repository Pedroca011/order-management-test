import { Router } from 'express';
import validate from '../../middlewares/validationMiddleware';
import { authController } from '../../controllers';
import { emailAddress, loginPassword } from '../../validators/authValidator';

//AUTH ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER LOGIN
_router
    .route('/login')
    .post(validate([emailAddress(), loginPassword()]), authController.login);

//EXPORT
export const router = _router;

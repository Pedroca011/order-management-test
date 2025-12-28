import { Router } from 'express';
import { authorization, emailAddress } from '../../validators/authValidator';
import validate from '../../middlewares/validationMiddleware';
import auth from '../../middlewares/authMiddleware';
import permit from '../../middlewares/permissionMiddleware';
import { password } from '../../validators/userValidator';
import { RoleType } from '../../utils/enums';
import { userController } from '../../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER SIGNUP
_router
    .route('/sign-up')
    .post(
        validate([
            emailAddress(),
            password('password'),
            password('confirmPassword'),
        ]),
        userController.createUser
    );

//GET USER DETAILS BY ID
_router
    .route('/fetch/:userId')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getUserById
    );

//GET ALL USER LIST
_router
    .route('/fetch')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getAllUser
    );

//EXPORT
export const router = _router;

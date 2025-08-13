const { body } = require('express-validator');
const C=require('../controllers/auth.controller.js');
const auth=require('../../../middlewares/auth.js')

const router=require('express').Router();


router.post('/resgister',[
    body('name').trim().notEmpty().withMessage('Name required'),

    body('email').isEmail().withMessage('Valid email required'),

    body('password').isLength({min:8}).withMessage('password min 8 chars'),
],
C.register
);

router.post('./login',[
    body('email').isEmail().withMessage('Valid email required'),

    body('password').notEmpty().withMessage('password required')
],
C.login
);

router.post('/refresh',C.refresh);
router.post('/logout',auth,C.logout);
router.get('/me',auth,C.me);

module.exports=router;
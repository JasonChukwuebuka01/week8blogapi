const router = require("express").Router();
const { signUpController, loginController } = require("../controllers/userAuth.controllers");
const {signUpSchema, loginSchema} = require("../validations/userAuth.schema");
const validate = require("../middleware/validate.middleware");

router.post("/sign-up", validate(signUpSchema), signUpController);
router.post("/sign-in", validate(loginSchema), loginController);

module.exports = router;

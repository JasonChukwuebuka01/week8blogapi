const router = require("express").Router();
const { signUpController, loginController } = require("../controllers/userAuth.controllers");
const  {profileAvaterController } = require("../controllers/profileAvatarController");
const {signUpSchema, loginSchema} = require("../validations/userAuth.schema");
const validate = require("../middleware/validate.middleware");
const protectAuth = require("../middleware/protectAuth.middleware");
const upload = require("../middleware/upload.middleware");



router.post("/sign-up", validate(signUpSchema), signUpController);
router.post("/sign-in", validate(loginSchema), loginController);
router.post("/profile-image", protectAuth, upload.single("avatar"), profileAvaterController);

module.exports = router;

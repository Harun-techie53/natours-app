const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");
const genCryptoHash = require("../utils/genCryptoHash");

const getJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, res) => {
  const token = getJwtToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //remove password from res body
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUpUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role, passwordConfirm } = req.body;

  const user = new User({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  await user.save();

  createSendToken(user, res);
});

exports.signInUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = new AppError("Please, enter email and password", 400);

    return next(err);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid Credentials!", 401));
  }

  console.log(password, user.password);

  const isPasswordMatch = await user.matchPassword(password, user.password);
  if (!isPasswordMatch) {
    return next(new AppError("Invalid Credentials!", 401));
  }

  createSendToken(user, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Please, provide your email first!", 400));
  }

  //Get the email address of user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User doesn't exist!", 404));
  }
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  //Send the password reset token to user's email

  let resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Your password reset token provided: \n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Forgot Password",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Reset token sent to the user's email!",
    });
  } catch (error) {
    //to see the error
    console.log(error);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There is an error occured to sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get the user based on the token
  const hashedToken = genCryptoHash(req.params.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is not valid or expired already!", 400));
  }

  //Get the new password and confirm it
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm) {
    return next(new AppError("Please, fill up the necessary fields!", 400));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = getJwtToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password changed successfully!",
    token,
  });
});

exports.updateCurrentUserPassword = catchAsync(async (req, res, next) => {
  //Get the user first
  const user = await User.findById(req.user.id);

  //Get the current password and then the new password
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;

  if (!currentPassword || !newPassword || !newPasswordConfirm) {
    return next(new AppError("Please, fill up the necessary fields!", 400));
  }

  const isMatch = await user.matchPassword(currentPassword, user.password);

  if (!isMatch) {
    next(new AppError("Invalid Credentials!", 401));
  }

  if (newPassword !== newPasswordConfirm) {
    return next(new AppError("Password didn't match!", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  user.passwordChangedAt = Date.now();

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
  });
});

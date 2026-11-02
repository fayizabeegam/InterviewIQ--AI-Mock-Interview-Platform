import React from "react";
import { render } from "@react-email/render";
import fs from "fs";
import path from "path";

import VerificationEmail from "../src/email/templates/VerificationEmail.jsx";
import PasswordResetEmail from "../src/email/templates/PasswordResetEmail.jsx";
import ChangePasswordOTPEmail from "../src/email/templates/ChangePasswordOTPEmail.jsx";

const outputDir = path.resolve(
  "D:/Fayiza/Django/InterviewIQ/Backend/accounts/templates/emails"
);

fs.mkdirSync(outputDir, { recursive: true });

async function renderEmails() {

  // Verification email
  const verificationHtml = await render(
    React.createElement(VerificationEmail, {
      name: "{{NAME}}",
      otp: "{{OTP}}",
    })
  );

  fs.writeFileSync(
    path.join(outputDir, "verification_email.html"),
    verificationHtml
  );


  // Password reset email
  const resetHtml = await render(
    React.createElement(PasswordResetEmail, {
      name: "{{NAME}}",
      resetLink: "{{RESET_LINK}}",
    })
  );

  fs.writeFileSync(
    path.join(outputDir, "password_reset_email.html"),
    resetHtml
  );

  // change password otp email
  const changePasswordHtml = await render(
    React.createElement(ChangePasswordOTPEmail, {
      name: "{{NAME}}",
      otp: "{{OTP}}",
    })
  );

  fs.writeFileSync(
    path.join(outputDir, "change_password_otp_email.html"),
    changePasswordHtml
  );

  console.log("Email templates rendered successfully.");
}

renderEmails();
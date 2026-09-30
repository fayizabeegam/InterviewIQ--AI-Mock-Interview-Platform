import React from "react";
import { Button, Text } from "@react-email/components";

import EmailLayout from "../components/EmailLayout";
import EmailHeader from "../components/Header";
import EmailFooter from "../components/Footer";

export default function PasswordResetEmail({
  name = "User",
  resetLink = "http://localhost:5173/reset-password",
}) {
  return (
    <EmailLayout
      preview="Reset your InterviewIQ password"
    >

      <EmailHeader
        title="Reset Your Password"
        subtitle="AI-Powered Interview Preparation Platform"
      />

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
          marginTop: "24px",
        }}
      >
        Hi <strong>{name}</strong>,
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
        }}
      >
        We received a request to reset your
        <strong> InterviewIQ </strong>
        account password.
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
        }}
      >
        Click the button below to create a new password.
      </Text>

      <div
        style={{
          textAlign: "center",
          margin: "32px 0",
        }}
      >
        <Button
          href={resetLink}
          style={{
            backgroundColor: "#2563EB",
            color: "#ffffff",
            padding: "14px 28px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Reset Password
        </Button>
      </div>

      <Text
        style={{
          color: "#6B7280",
          fontSize: "14px",
          lineHeight: "22px",
          textAlign: "center",
        }}
      >
        If the button doesn't work, copy and paste the
        password reset link into your browser.
      </Text>

      <EmailFooter  type="password-reset" />

    </EmailLayout>
  );
}
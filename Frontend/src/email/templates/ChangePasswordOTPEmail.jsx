
import React from "react";
import { Text } from "@react-email/components";

import EmailLayout from "../components/EmailLayout";
import EmailHeader from "../components/Header";
import EmailFooter from "../components/Footer";

export default function ChangePasswordOTPEmail({
  name = "User",
  otp = "{{OTP}}",
}) {
  return (
    <EmailLayout preview="Your InterviewIQ password change verification code">
      <EmailHeader
        title="Change Password"
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
        Hello <strong>{name}</strong>,
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
        }}
      >
        We received a request to change your InterviewIQ account password.
        Use the verification code below to continue.
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
        }}
      >
        Your OTP is:
      </Text>

      <Text
        style={{
          color: "#111827",
          fontSize: "16px",
          fontWeight: "700",
          letterSpacing: "6px",
          margin: "20px 0",
        }}
      >
        {otp}
      </Text>

      <Text
        style={{
          color: "#6B7280",
          fontSize: "14px",
          lineHeight: "22px",
        }}
      >
        This OTP is valid for 10 minutes.
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "14px",
          lineHeight: "22px",
        }}
      >
        If you didn't request this change, please ignore this email and
        keep your account secure.
      </Text>

      <EmailFooter type="password-change" />
    </EmailLayout>
  );
}

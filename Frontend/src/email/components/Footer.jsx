import React from "react";
import { Hr, Text } from "@react-email/components";

export default function EmailFooter({ type = "otp" }) {
  return (
    <>
      <Hr />

      <Text
        style={{
          color: "#6B7280",
          fontSize: "13px",
          textAlign: "center",
          lineHeight: "22px",
        }}
      >
        {type === "otp"
        ?"This OTP is valid for 10 minutes."
        : "This password reset link will expire automatically."}
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          fontSize: "12px",
          textAlign: "center",
        }}
      >
        If you didn't create an InterviewIQ account,
        you can safely ignore this email.
      </Text>

      <Text
        style={{
          color: "#9CA3AF",
          fontSize: "12px",
          textAlign: "center",
          marginTop: "24px",
        }}
      >
        © {new Date().getFullYear()} InterviewIQ.
        All rights reserved.
      </Text>
    </>
  );
}
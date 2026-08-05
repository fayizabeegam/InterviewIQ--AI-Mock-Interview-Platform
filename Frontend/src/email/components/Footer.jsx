import { Hr, Text } from "@react-email/components";

export default function EmailFooter() {
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
        This OTP is valid for 10 minutes.
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
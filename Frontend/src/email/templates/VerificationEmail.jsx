import { Text } from "@react-email/components";

import EmailLayout from "../components/EmailLayout";
import EmailHeader from "../components/Header";
import OTPCard from "../components/OtpCard";
import EmailFooter from "../components/Footer";

export default function VerificationEmail({
  name = "User",
  otp = "123456",
}) {
  return (
    <EmailLayout preview="Verify your InterviewIQ account">
      <EmailHeader
        title="Email Verification"
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
        Thank you for registering with <strong>InterviewIQ</strong>.
      </Text>

      <Text
        style={{
          color: "#374151",
          fontSize: "16px",
          lineHeight: "26px",
        }}
      >
        Please use the verification code below to verify your email address.
      </Text>

      <OTPCard otp={otp} />

      <EmailFooter />
    </EmailLayout>
  );
}
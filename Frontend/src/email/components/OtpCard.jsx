import { Section, Text } from "@react-email/components";

export default function OTPCard({ otp }) {
  return (
    <Section
      style={{
        backgroundColor: "#EFF6FF",
        border: "2px dashed #2563EB",
        borderRadius: "12px",
        padding: "24px",
        margin: "30px 0",
        textAlign: "center",
      }}
    >
      <Text
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#6B7280",
        }}
      >
        Verification Code
      </Text>

      <Text
        style={{
          margin: "15px 0 0",
          fontSize: "40px",
          fontWeight: "700",
          letterSpacing: "8px",
          color: "#2563EB",
        }}
      >
        {otp}
      </Text>
    </Section>
  );
}
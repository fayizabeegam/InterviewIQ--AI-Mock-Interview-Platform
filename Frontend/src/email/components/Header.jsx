import { Heading, Text } from "@react-email/components";

export default function EmailHeader({ title, subtitle }) {
  return (
    <>
      <Heading
        style={{
          margin: 0,
          color: "#2563EB",
          fontSize: "32px",
          textAlign: "center",
          fontWeight: "700",
        }}
      >
        InterviewIQ
      </Heading>

      <Text
        style={{
          marginTop: "8px",
          color: "#6B7280",
          textAlign: "center",
          fontSize: "16px",
        }}
      >
        {subtitle}
      </Text>

      <Heading
        as="h2"
        style={{
          marginTop: "32px",
          color: "#111827",
          fontSize: "26px",
          textAlign: "center",
        }}
      >
        {title}
      </Heading>
    </>
  );
}
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
} from "@react-email/components";

export default function EmailLayout({
  preview,
  children,
}) {
  return (
    <Html>
      <Head />

      <Preview>{preview}</Preview>

      <Body
        style={{
          backgroundColor: "#f4f7fb",
          margin: 0,
          padding: "40px 0",
          fontFamily:
            "Inter, Arial, Helvetica, sans-serif",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "40px",
            boxShadow:
              "0 4px 20px rgba(0,0,0,.08)",
          }}
        >
          {children}
        </Container>
      </Body>
    </Html>
  );
}
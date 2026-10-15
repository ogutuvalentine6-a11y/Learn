import { Html, Body, Container, Heading, Text, Button, Section } from "react-email";

interface Props {
  name: string;
  verifyUrl: string;
}

export default function VerificationEmail({ name, verifyUrl }: Props) {
  return (
    <Html>
      <Body style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f5", padding: 20 }}>
        <Container style={{ background: "#fff", padding: 30, borderRadius: 8 }}>
          <Heading style={{ color: "#4f46e5" }}>Verify your email</Heading>
          <Text>Hi {name},</Text>
          <Text>Thanks for signing up. Click the button below to verify your email address.</Text>
          <Section style={{ textAlign: "center", margin: "30px 0" }}>
            <Button
              href={verifyUrl}
              style={{
                background: "#4f46e5",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              Verify Email
            </Button>
          </Section>
          <Text style={{ fontSize: 12, color: "#666" }}>
            If you didn't create an account, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

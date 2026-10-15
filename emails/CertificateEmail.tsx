import { Html, Body, Container, Heading, Text, Button, Section } from "react-email";

interface Props {
  name: string;
  courseTitle: string;
  certificateUrl: string;
  certificateId: string;
}

export default function CertificateEmail({
  name,
  courseTitle,
  certificateUrl,
  certificateId,
}: Props) {
  return (
    <Html>
      <Body style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f5", padding: 20 }}>
        <Container style={{ background: "#fff", padding: 30, borderRadius: 8 }}>
          <Heading style={{ color: "#4f46e5" }}>Congratulations, {name}!</Heading>
          <Text>
            You have successfully completed <strong>{courseTitle}</strong>.
          </Text>
          <Text>Your certificate ID is: <strong>{certificateId}</strong></Text>
          <Section style={{ textAlign: "center", margin: "30px 0" }}>
            <Button
              href={certificateUrl}
              style={{
                background: "#4f46e5",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              View Certificate
            </Button>
          </Section>
          <Text style={{ fontSize: 12, color: "#666" }}>
            Keep this email for your records.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

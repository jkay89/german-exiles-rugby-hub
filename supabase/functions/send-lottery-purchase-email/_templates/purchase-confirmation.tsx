import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PurchaseConfirmationProps {
  customerName: string
  numbers: number[]
  drawDate: string
  jackpotAmount: number
  lineNumber: number
}

export const PurchaseConfirmationEmail = ({
  customerName,
  numbers,
  drawDate,
  jackpotAmount,
  lineNumber,
}: PurchaseConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your lottery numbers have been confirmed!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎰 Lottery Purchase Confirmed!</Heading>
        
        <Text style={text}>
          Dear {customerName || 'Valued Customer'},
        </Text>
        
        <Text style={text}>
          Thank you for your lottery purchase! Your numbers have been successfully registered for the upcoming draw.
        </Text>

        <Section style={numbersSection}>
          <Heading style={h2}>Your Lucky Numbers</Heading>
          <Row>
            {numbers.map((number, index) => (
              <Column key={index} style={numberCell}>
                <div style={numberBall}>{number}</div>
              </Column>
            ))}
          </Row>
        </Section>

        <Section style={detailsSection}>
          <Text style={detailText}><strong>Line Number:</strong> {lineNumber}</Text>
          <Text style={detailText}><strong>Draw Date:</strong> {new Date(drawDate).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          <Text style={detailText}><strong>Current Jackpot:</strong> £{jackpotAmount.toLocaleString()}</Text>
        </Section>

        <Text style={text}>
          Good luck! The draw results will be announced on the draw date. We'll notify you if you're a winner!
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Lottery Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PurchaseConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 20px',
}

const detailText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '8px 20px',
}

const numbersSection = {
  margin: '32px 0',
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
}

const detailsSection = {
  margin: '24px 0',
  padding: '16px 0',
  borderTop: '1px solid #eee',
  borderBottom: '1px solid #eee',
}

const numberCell = {
  textAlign: 'center' as const,
  padding: '0 5px',
}

const numberBall = {
  display: 'inline-block',
  width: '40px',
  height: '40px',
  lineHeight: '40px',
  backgroundColor: '#007bff',
  color: 'white',
  borderRadius: '50%',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 20px 0',
}
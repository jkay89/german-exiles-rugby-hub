import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface SubscriptionConfirmationProps {
  customerName: string
  numbers: number[]
  drawDate: string
  jackpotAmount: number
  lineNumber: number
  nextPaymentDate: string
}

export const SubscriptionConfirmationEmail = ({
  customerName,
  numbers,
  drawDate,
  jackpotAmount,
  lineNumber,
  nextPaymentDate,
}: SubscriptionConfirmationProps) => (
  <Html>
    <Head />
    <Preview>Your lottery subscription is active!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://hmjwfnsygwzijjgrygia.supabase.co/storage/v1/object/public/media/d5497b13-60f3-4490-9abb-bc42b3027140.png"
            alt="German Exiles RL Logo"
            width="80"
            height="80"
            style={logoStyle}
          />
          <Text style={brandText}>German Exiles RL</Text>
        </Section>
        <Heading style={h1}>🎯 Lottery Subscription Confirmed!</Heading>
        
        <Text style={text}>
          Dear {customerName || 'Valued Customer'},
        </Text>
        
        <Text style={text}>
          Welcome to our monthly lottery subscription! Your numbers have been registered and will automatically enter every monthly draw.
        </Text>

        <Section style={numbersSection}>
          <Heading style={h2}>Your Monthly Lucky Numbers</Heading>
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
          <Text style={detailText}><strong>Next Draw Date:</strong> {new Date(drawDate).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
          <Text style={detailText}><strong>Current Jackpot:</strong> £{jackpotAmount.toLocaleString()}</Text>
          <Text style={detailText}><strong>Next Payment:</strong> {new Date(nextPaymentDate).toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Text>
        </Section>

        <Section style={subscriptionInfo}>
          <Heading style={h3}>Subscription Details</Heading>
          <Text style={smallText}>
            • Your numbers will automatically enter every monthly draw<br />
            • Payment will be collected on the 1st of each month<br />
            • You can cancel your subscription at any time<br />
            • We'll send you a reminder email before each draw
          </Text>
        </Section>

        <Text style={text}>
          Good luck with your first draw! We'll email you the results and notify you if you're a winner.
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Lottery Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default SubscriptionConfirmationEmail

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

const h3 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
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

const smallText = {
  color: '#555',
  fontSize: '14px',
  lineHeight: '22px',
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

const subscriptionInfo = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#e8f5e8',
  borderRadius: '8px',
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
  backgroundColor: '#28a745',
  color: 'white',
  borderRadius: '50%',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
}

const logoSection = {
  textAlign: 'center' as const,
  margin: '20px 0 30px',
}

const logoStyle = {
  margin: '0 auto',
  display: 'block',
}

const brandText = {
  color: '#d4af37',
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '10px 0 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '32px 20px 0',
}
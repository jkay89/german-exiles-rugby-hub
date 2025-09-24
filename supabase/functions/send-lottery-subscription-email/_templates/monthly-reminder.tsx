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
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface MonthlyReminderProps {
  customerName: string
  numbers: number[]
  drawDate: string
  jackpotAmount: number
  lineNumber: number
  paymentAmount: number
}

export const MonthlyReminderEmail = ({
  customerName,
  numbers,
  drawDate,
  jackpotAmount,
  lineNumber,
  paymentAmount,
}: MonthlyReminderProps) => (
  <Html>
    <Head />
    <Preview>Your monthly lottery entry is confirmed!</Preview>
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
        <Heading style={h1}>📅 Monthly Lottery Reminder</Heading>
        
        <Text style={text}>
          Dear {customerName || 'Valued Customer'},
        </Text>
        
        <Text style={text}>
          Your monthly lottery subscription payment of £{paymentAmount} has been processed successfully. Your numbers are entered for this month's draw!
        </Text>

        <Section style={numbersSection}>
          <Heading style={h2}>Your Numbers for This Draw</Heading>
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
          <Text style={detailText}><strong>Payment Amount:</strong> £{paymentAmount}</Text>
        </Section>

        <Text style={text}>
          Good luck with this month's draw! We'll notify you as soon as the results are announced.
        </Text>

        <Text style={smallText}>
          You can manage your subscription or view your entry history anytime in your account dashboard.
        </Text>

        <Text style={footer}>
          Best regards,<br />
          The Lottery Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MonthlyReminderEmail

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
  fontSize: '26px',
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

const smallText = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 20px',
}

const numbersSection = {
  margin: '32px 0',
  padding: '20px',
  backgroundColor: '#fff8e1',
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
  backgroundColor: '#ffc107',
  color: '#333',
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
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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface LuckyDipWinnerEmailProps {
  winnerName?: string
  prizeAmount: number
  drawDate: string
  winningNumbers: number[]
}

export const LuckyDipWinnerEmail = ({
  winnerName = "Lucky Winner",
  prizeAmount,
  drawDate,
  winningNumbers,
}: LuckyDipWinnerEmailProps) => (
  <Html>
    <Head />
    <Preview>🎉 You're a Lucky Dip Winner! £{prizeAmount} is yours!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Celebration Header */}
        <Section style={celebrationHeader}>
          <div style={confetti}>🎊</div>
          <div style={confetti}>🎉</div>
          <div style={confetti}>🏆</div>
          <div style={confetti}>💰</div>
          <div style={confetti}>🎊</div>
          <Heading style={mainHeading}>
            LUCKY DIP WINNER!
          </Heading>
          <div style={winnerBadge}>
            YOU'VE WON £{prizeAmount}!
          </div>
          <div style={celebration}>🎉 🏉 🎉</div>
        </Section>

        {/* Prize Announcement */}
        <Section style={prizeSection}>
          <div style={prizeContainer}>
            <div style={prizeAmount}>£{prizeAmount}</div>
            <div style={prizeLabel}>🍀 LUCKY DIP PRIZE 🍀</div>
            <div style={randomSelection}>
              ✨ Randomly selected from all entries! ✨
            </div>
          </div>
        </Section>

        {/* Congratulations Message */}
        <Section style={messageSection}>
          <Text style={congratsText}>
            🏆 CONGRATULATIONS {winnerName.toUpperCase()}! 🏆
          </Text>
          <Text style={description}>
            The lottery gods have smiled upon you! You've been randomly selected as a Lucky Dip winner 
            in the German Exiles Rugby League Lottery. No number matching needed - just pure luck! 🍀
          </Text>
        </Section>

        {/* Draw Details */}
        <Section style={drawSection}>
          <Heading style={sectionHeading}>🎯 Draw Details</Heading>
          <div style={drawInfo}>
            <Text style={drawText}>
              <strong>📅 Draw Date:</strong> {new Date(drawDate).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={drawText}>
              <strong>🎱 Winning Numbers:</strong>
            </Text>
            <div style={numbersContainer}>
              {winningNumbers.map((num, index) => (
                <div key={index} style={numberBall}>{num}</div>
              ))}
            </div>
          </div>
        </Section>

        {/* Claim Instructions */}
        <Section style={claimSection}>
          <Heading style={claimHeading}>💎 How to Claim Your Prize</Heading>
          <Text style={claimIntro}>
            Ready to get your hands on that cash? Here's what you need to do:
          </Text>
          <div style={requirementsList}>
            <div style={requirement}>
              <span style={checkmark}>📷</span>
              <span>A clear photo of your government-issued ID (passport or driving licence)</span>
            </div>
            <div style={requirement}>
              <span style={checkmark}>🏦</span>
              <span>Your bank account details for the prize transfer</span>
            </div>
            <div style={requirement}>
              <span style={checkmark}>📧</span>
              <span>A copy of this winning notification email</span>
            </div>
          </div>
          
          <div style={contactBox}>
            <Text style={contactTitle}>📬 Send everything to:</Text>
            <Link href="mailto:jay@germanexilesrl.co.uk" style={contactEmail}>
              jay@germanexilesrl.co.uk
            </Link>
            <Text style={timeline}>
              ⚡ Prize processed within 5-7 working days ⚡
            </Text>
          </div>
        </Section>

        {/* Excitement Footer */}
        <Section style={excitementSection}>
          <Text style={excitementText}>
            🏉 "What a result! Congratulations from everyone at German Exiles Rugby League!" 🏉
          </Text>
          <div style={partyEmojis}>
            🎊 🍾 🎉 🏆 💰 🎊 🍾 🎉
          </div>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerTitle}>German Exiles Rugby League</Text>
          <Text style={footerText}>Supporting rugby league in Germany 🏉</Text>
          <Text style={footerSmall}>
            Keep this email as proof of your prize win. Good luck and well done! 🍀
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default LuckyDipWinnerEmail

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  maxWidth: '600px',
}

const celebrationHeader = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '12px 12px 0 0',
  position: 'relative' as const,
}

const confetti = {
  fontSize: '24px',
  display: 'inline-block',
  margin: '0 10px',
  animation: 'bounce 2s infinite',
}

const mainHeading = {
  margin: '20px 0 10px 0',
  fontSize: '32px',
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  letterSpacing: '2px',
}

const winnerBadge = {
  background: '#10b981',
  color: 'white',
  padding: '15px 30px',
  borderRadius: '50px',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px auto',
  display: 'inline-block',
  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
}

const celebration = {
  fontSize: '28px',
  margin: '20px 0',
}

const prizeSection = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  borderRadius: '12px',
  margin: '20px 0',
}

const prizeContainer = {
  padding: '20px',
}

const prizeAmount = {
  fontSize: '48px',
  fontWeight: 'bold',
  color: '#b91c1c',
  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  margin: '0',
}

const prizeLabel = {
  fontSize: '18px',
  color: '#059669',
  fontWeight: 'bold',
  margin: '10px 0',
}

const randomSelection = {
  fontSize: '14px',
  color: '#6b7280',
  fontStyle: 'italic',
  margin: '10px 0',
}

const messageSection = {
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const congratsText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 20px 0',
}

const description = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#374151',
  margin: '0',
}

const drawSection = {
  background: '#f3f4f6',
  padding: '25px',
  borderRadius: '12px',
  margin: '20px 0',
}

const sectionHeading = {
  fontSize: '20px',
  color: '#1f2937',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
}

const drawInfo = {
  textAlign: 'center' as const,
}

const drawText = {
  fontSize: '16px',
  color: '#374151',
  margin: '10px 0',
}

const numbersContainer = {
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
  margin: '20px 0',
  flexWrap: 'wrap' as const,
}

const numberBall = {
  background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
  color: 'white',
  width: '45px',
  height: '45px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '18px',
  boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)',
}

const claimSection = {
  background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
  padding: '30px',
  borderRadius: '12px',
  margin: '20px 0',
}

const claimHeading = {
  fontSize: '22px',
  color: '#92400e',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
}

const claimIntro = {
  fontSize: '16px',
  color: '#78350f',
  textAlign: 'center' as const,
  margin: '0 0 20px 0',
  fontWeight: '500',
}

const requirementsList = {
  margin: '20px 0',
}

const requirement = {
  background: 'white',
  padding: '15px 20px',
  margin: '10px 0',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
}

const checkmark = {
  fontSize: '20px',
  minWidth: '25px',
}

const contactBox = {
  background: 'white',
  padding: '25px',
  borderRadius: '12px',
  textAlign: 'center' as const,
  margin: '20px 0',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
}

const contactTitle = {
  fontSize: '16px',
  color: '#374151',
  margin: '0 0 10px 0',
  fontWeight: '600',
}

const contactEmail = {
  color: '#1e40af',
  fontSize: '20px',
  fontWeight: 'bold',
  textDecoration: 'none',
  display: 'block',
  margin: '10px 0',
}

const timeline = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '15px 0 0 0',
}

const excitementSection = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  background: 'linear-gradient(135deg, #e0f2fe, #81d4fa)',
  borderRadius: '12px',
  margin: '20px 0',
}

const excitementText = {
  fontSize: '18px',
  color: '#0c4a6e',
  fontStyle: 'italic',
  fontWeight: '500',
  margin: '0 0 15px 0',
}

const partyEmojis = {
  fontSize: '24px',
  letterSpacing: '8px',
}

const footer = {
  background: '#1f2937',
  color: '#9ca3af',
  textAlign: 'center' as const,
  padding: '30px 20px',
  borderRadius: '0 0 12px 12px',
}

const footerTitle = {
  color: 'white',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const footerText = {
  fontSize: '14px',
  margin: '5px 0',
}

const footerSmall = {
  fontSize: '12px',
  margin: '15px 0 0 0',
  opacity: 0.8,
}
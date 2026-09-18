import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface ContactNotificationProps {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export function ContactNotification({
  name = 'Unknown sender',
  email = 'unknown@example.com',
  phone = '',
  message = '',
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New message from ${name}`}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'Helvetica, Arial, sans-serif', color: '#1a1a1a' }}>
        <Container style={{ padding: '32px 24px', maxWidth: '560px' }}>
          <Heading style={{ fontSize: '20px', fontWeight: 400, margin: '0 0 24px' }}>
            New message from your website
          </Heading>
          <Section>
            <Text style={{ margin: '0 0 8px' }}><strong>Name:</strong> {name}</Text>
            <Text style={{ margin: '0 0 8px' }}><strong>Email:</strong> {email}</Text>
            {phone ? <Text style={{ margin: '0 0 8px' }}><strong>Phone:</strong> {phone}</Text> : null}
          </Section>
          <Hr style={{ borderColor: '#e6e6e6', margin: '24px 0' }} />
          <Text style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0 }}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactNotification,
  displayName: 'Contact form notification',
  subject: (data: Record<string, any>) => `New message from ${data['name'] ?? 'your website'}`,
  to: 'alenakuritka@gmail.com',
  previewData: {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+420 721 011 680',
    message: 'Hello Alena,\n\nI love your illustrations and would like to discuss a project.',
  },
} satisfies TemplateEntry

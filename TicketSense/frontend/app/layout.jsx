import './globals.css';

export const metadata = {
  title: 'TicketSense | Support Workspace',
  description: 'Classify customer support inquiries, find the right destination team, and keep service response targets in view.',
  keywords: 'customer support, ticket classification, intent recognition, SLA routing, helpdesk triage',
  authors: [{ name: 'TicketSense Engineering' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

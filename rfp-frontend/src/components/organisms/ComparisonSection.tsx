import { Badge, Card, Group, Table, Text, Title } from '@mantine/core';
import type { AiVerdict, Proposal } from '../../types';

interface Props {
  verdict: AiVerdict;
  proposals: Proposal[];
}

export const ComparisonSection = ({ verdict, proposals }: Props) => {
  if (!verdict) return null;

  return (
    <Card 
      shadow="xl" 
      p="xl" 
      radius="lg" 
      withBorder 
      style={{ 
        border: '2px solid',
        borderColor: verdict.score > 80 ? '#22c55e' : '#eab308',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
      className="fade-in"
    >
      <Group justify="space-between" mb="xl">
        <Title order={2} style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          AI Recommendation
        </Title>
        <Badge 
          size="xl" 
          variant="gradient"
          gradient={verdict.score > 80 ? 
            { from: 'green', to: 'teal', deg: 45 } : 
            { from: 'yellow', to: 'orange', deg: 45 }
          }
          style={{
            fontSize: '16px',
            padding: '12px 20px',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
          }}
        >
          Score: {verdict.score}/100
        </Badge>
      </Group>

      <div style={{
        textAlign: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '16px',
        marginBottom: '32px',
        border: '2px solid rgba(102, 126, 234, 0.2)',
      }}>
        <Text size="xl" fw={800} c="violet" ta="center" my="sm" style={{ fontSize: '28px' }}>
          🏆 Winner: {verdict.recommendedVendor}
        </Text>
      </div>
      
      <Card 
        withBorder 
        radius="md" 
        p="lg" 
        mb="xl"
        style={{
          background: 'rgba(248, 250, 252, 0.8)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
        }}
      >
         <Text style={{ fontStyle: 'italic', fontSize: '16px', lineHeight: 1.7, color: '#475569' }}>
           "{verdict.reason}"
         </Text>
      </Card>

      <Title order={4} mb="md" style={{ color: '#1e293b' }}>Comparison Table</Title>
      <Table 
        striped 
        highlightOnHover 
        withTableBorder
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <thead>
          <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <th style={{ color: 'white', fontWeight: 700, padding: '16px' }}>Vendor</th>
            <th style={{ color: 'white', fontWeight: 700, padding: '16px' }}>Price</th>
            <th style={{ color: 'white', fontWeight: 700, padding: '16px' }}>Delivery</th>
            <th style={{ color: 'white', fontWeight: 700, padding: '16px' }}>Warranty</th>
          </tr>
        </thead>
        <tbody>
          {proposals.map((p, index) => (
            <tr 
              key={p._id}
              style={{
                transition: 'all 0.2s',
                backgroundColor: index % 2 === 0 ? 'rgba(248, 250, 252, 0.5)' : 'white',
              }}
            >
              <td style={{ fontWeight: 600, padding: '16px', color: '#1e293b' }}>
                {p.vendorName.split('<')[0]}
              </td>
              <td style={{ padding: '16px', fontWeight: 600, color: '#059669' }}>
                ${p.price?.toLocaleString()}
              </td>
              <td style={{ padding: '16px', color: '#475569' }}>{p.deliveryDate}</td>
              <td style={{ padding: '16px', color: '#475569' }}>{p.warranty}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};


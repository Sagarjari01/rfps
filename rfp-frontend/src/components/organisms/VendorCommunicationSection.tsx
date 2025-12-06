import { Button, Card } from '@mantine/core';
import { IconMail } from '@tabler/icons-react';
import { SectionTitle } from '../atoms/SectionTitle';

interface Props {
  onSync: () => void;
  loading: boolean;
}

export const VendorCommunicationSection = ({ onSync, loading }: Props) => {
  return (
    <Card 
      shadow="md" 
      p="xl" 
      radius="lg" 
      withBorder
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      className="card-hover fade-in"
    >
      <SectionTitle icon={IconMail} color="orange" title="2. Vendor Communication" />
      <Button 
        variant="gradient"
        gradient={{ from: 'orange', to: 'red', deg: 45 }}
        fullWidth 
        size="lg" 
        onClick={onSync} 
        loading={loading}
        style={{
          boxShadow: '0 4px 14px rgba(251, 146, 60, 0.4)',
          fontWeight: 600,
          fontSize: '16px',
          height: '48px',
        }}
      >
        {loading ? 'Checking Inbox...' : 'Check Inbox for Vendor Replies'}
      </Button>
    </Card>
  );
};


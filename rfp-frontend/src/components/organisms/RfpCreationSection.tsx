import { Alert, Button, Card, Grid, Text, Textarea } from '@mantine/core';
import { IconCheck, IconRobot } from '@tabler/icons-react';
import { SectionTitle } from '../atoms/SectionTitle';
import type { Rfp } from '../../types';

interface Props {
  rfpText: string;
  setRfpText: (val: string) => void;
  createRfp: () => void;
  loading: boolean;
  currentRfp: Rfp | null;
  emailStatus: string;
}

export const RfpCreationSection = ({ rfpText, setRfpText, createRfp, loading, currentRfp, emailStatus }: Props) => {
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
      <SectionTitle icon={IconRobot} color="violet" title="1. Define Requirement" />
      
      <Textarea 
        placeholder="e.g. I need 20 Dell Laptops with 16GB RAM, 50 Keyboards, and 30 monitors. Budget is $40,000. Need them delivered by next Friday." 
        label="What do you need to buy?"
        minRows={4}
        size="md"
        value={rfpText}
        onChange={(e) => setRfpText(e.currentTarget.value)}
        style={{
          fontSize: '15px',
        }}
      />
      
      <Button 
        mt="lg" 
        size="lg" 
        fullWidth 
        onClick={createRfp} 
        loading={loading}
        variant="gradient"
        gradient={{ from: 'violet', to: 'purple', deg: 45 }}
        style={{
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
          fontWeight: 600,
          fontSize: '16px',
          height: '48px',
        }}
      >
        {loading ? 'Processing...' : 'Generate RFP & Email Vendors'}
      </Button>

      {currentRfp && (
        <Alert 
          color="green" 
          mt="xl" 
          title="RFP Created Successfully!" 
          icon={<IconCheck size={20}/>}
          style={{
            borderRadius: '12px',
            border: '2px solid rgba(34, 197, 94, 0.2)',
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
          }}
          className="slide-in"
        >
          <Grid mt="sm">
            <Grid.Col span={6}>
              <Text size="sm" fw={700} c="dark">Parsed Items:</Text>
              <Text size="sm" c="dimmed" mt={4}>
                {currentRfp.structuredData?.items?.join(', ') || 'Processing...'}
              </Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text size="sm" fw={700} c="dark">Budget:</Text>
              <Text size="sm" c="dimmed" mt={4} fw={600}>
                ${currentRfp.structuredData?.budget?.toLocaleString() || '0'}
              </Text>
            </Grid.Col>
          </Grid>
          <Text size="sm" c="violet" mt="md" fw={600}>{emailStatus}</Text>
        </Alert>
      )}
    </Card>
  );
};


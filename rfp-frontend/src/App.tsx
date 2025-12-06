import { useEffect, useState } from 'react';
import { Container, Group, Stack, ThemeIcon, Title } from '@mantine/core';
import { IconCpu } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import { VendorManagementSection } from './components/organisms/VendorManagementSection';
import { RfpCreationSection } from './components/organisms/RfpCreationSection';
import { VendorCommunicationSection } from './components/organisms/VendorCommunicationSection';
import { ComparisonSection } from './components/organisms/ComparisonSection';

import { api } from './services/api';
import type { Rfp, Vendor, Proposal, AiVerdict } from './types';

function App() {
  const [rfpText, setRfpText] = useState('');
  const [currentRfp, setCurrentRfp] = useState<Rfp | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [verdict, setVerdict] = useState<AiVerdict | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [vendorFormOpened, { toggle: toggleVendorForm }] = useDisclosure(false);

  const loadVendors = async () => {
    try {
      const data = await api.fetchVendors();
      setVendors(data);
    } catch (err) {
      console.error('Failed to load vendors', err);
    }
  };

  useEffect(() => { loadVendors(); }, []);

  const handleAddVendor = async (name: string, email: string) => {
    try {
      await api.addVendor({ name, email, category: 'General' });
      alert('Vendor Added!');
      toggleVendorForm();
      loadVendors();
    } catch {
      alert('Failed to add vendor');
    }
  };

  const handleCreateRfp = async () => {
    if (!rfpText) return;
    setLoading(true);
    setEmailStatus(''); 

    try {
      const rfp = await api.createRfp(rfpText);
      setCurrentRfp(rfp);
      setProposals([]);
      setVerdict(null);

      if (vendors.length > 0) {
        await api.sendRfpEmails(rfp._id, vendors.map(v => v._id));
        setEmailStatus(`Successfully emailed ${vendors.length} vendor(s).`);
      } else {
        setEmailStatus('No vendors found. Please add vendors first!');
      }
    } catch {
      alert('Backend Error');
    }
    setLoading(false);
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      const syncData = await api.syncEmails();
      
      if (currentRfp?._id) {
        const compData = await api.getComparison(currentRfp._id);
        
        if (compData.proposals) setProposals(compData.proposals);
        if (compData.aiRecommendation) setVerdict(compData.aiRecommendation);
        
        if (syncData.processedCount > 0) alert(`Found ${syncData.processedCount} new email(s)!`);
        else alert('No new emails found.');
      }
    } catch {
      alert('Sync failed');
    }
    setSyncLoading(false);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '2rem 0',
    }}>
      <Container size="lg" py="xl">
        <Group justify="center" mb={50} className="fade-in">
          <ThemeIcon 
            size={60} 
            radius="xl" 
            variant="gradient"
            gradient={{ from: 'violet', to: 'purple', deg: 45 }}
            style={{
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            }}
          >
            <IconCpu size={32} />
          </ThemeIcon>
          <Title 
            order={1} 
            ta="center" 
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            RFP Management System
          </Title>
        </Group>

        <Stack gap="xl">

        <VendorManagementSection 
          vendors={vendors}
          formOpened={vendorFormOpened}
          onToggleForm={toggleVendorForm}
          onAddVendor={handleAddVendor}
        />
        
        <RfpCreationSection 
          rfpText={rfpText}
          setRfpText={setRfpText}
          createRfp={handleCreateRfp}
          loading={loading}
          currentRfp={currentRfp}
          emailStatus={emailStatus}
        />

        {currentRfp && (
          <VendorCommunicationSection 
            onSync={handleSync}
            loading={syncLoading}
          />
        )}

        {verdict && <ComparisonSection verdict={verdict} proposals={proposals} />}

        </Stack>
      </Container>
    </div>
  );
}

export default App;

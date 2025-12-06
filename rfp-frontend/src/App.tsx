import { useState, useEffect } from 'react';
import { 
  Container, Title, Text, Textarea, Button, Card, Group, Badge, Table, Stack, Alert, ThemeIcon, TextInput, Collapse
} from '@mantine/core';
import { IconCheck, IconMail, IconRobot, IconCpu, IconPlus, IconUser } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

// --- CONFIGURATION ---
const API_URL = 'http://127.0.0.1:5001';

function App() {
  // State
  const [rfpText, setRfpText] = useState('');
  const [currentRfp, setCurrentRfp] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<any>(null);
  
  // Vendor Form State
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorEmail, setNewVendorEmail] = useState('');
  const [opened, { toggle }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [syncLoading, setSyncLoading] = useState(false);

  // 1. Fetch Vendors
  const fetchVendors = async () => {
    try {
      const res = await fetch(`${API_URL}/vendors`);
      const data = await res.json();
      setVendors(data);
    } catch (err) {
      console.error('Failed to load vendors', err);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  // 2. Add New Vendor (For the Demo)
  const addVendor = async () => {
    if(!newVendorName || !newVendorEmail) return;
    try {
      await fetch(`${API_URL}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newVendorName, email: newVendorEmail, category: 'General' }),
      });
      setNewVendorName('');
      setNewVendorEmail('');
      fetchVendors();
      alert('Vendor Added!');
      toggle();
    } catch(err) {
      alert('Failed to add vendor');
    }
  };

  // STEP 1: Create RFP & Email
  const createRfpAndSend = async () => {
    if (!rfpText) return;
    setLoading(true);
    setEmailStatus(''); 
    try {
      const createRes = await fetch(`${API_URL}/rfps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rfpText }),
      });
      const rfpData = await createRes.json();
      setCurrentRfp(rfpData);
      setProposals([]);
      setVerdict(null);

      if (vendors.length > 0) {
        const vendorIds = vendors.map(v => v._id);
        await fetch(`${API_URL}/rfps/${rfpData._id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorIds }),
        });
        setEmailStatus(`Successfully emailed ${vendors.length} vendor(s).`);
      } else {
        setEmailStatus('No vendors found. Please add vendors first!');
      }
    } catch (err) {
      alert('Backend Error');
    }
    setLoading(false);
  };

  // STEP 2 & 3: Sync & Compare
  const syncEmails = async () => {
    setSyncLoading(true);
    try {
      const res = await fetch(`${API_URL}/proposals/sync`, { method: 'POST' });
      const data = await res.json();
      
      if (currentRfp?._id) {
        const compRes = await fetch(`${API_URL}/rfps/${currentRfp._id}/comparison`);
        const compData = await compRes.json();
        
        if (compData.proposals) setProposals(compData.proposals);
        if (compData.aiRecommendation) setVerdict(compData.aiRecommendation);
        
        if (data.processedCount > 0) alert(`Found ${data.processedCount} new email(s)!`);
        else alert('No new emails found. Did you reply?');
      }
    } catch (err) {
      alert('Sync failed');
    }
    setSyncLoading(false);
  };

  return (
    <Container size="md" py="xl" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <Group justify="center" mb={40}>
        <ThemeIcon size={40} radius="xl" color="blue">
          <IconCpu size={24} />
        </ThemeIcon>
        <Title order={1} ta="center">AI Procurement Agent</Title>
      </Group>

      <Stack gap="xl">
        
        {/* --- SECTION 0: MANAGE VENDORS (New!) --- */}
        <Card shadow="xs" p="md" radius="md" withBorder>
          <Group justify="space-between" onClick={toggle} style={{cursor: 'pointer'}}>
             <Group>
                <ThemeIcon color="gray" variant="light"><IconUser size={20}/></ThemeIcon>
                <Title order={4}>Registered Vendors ({vendors.length})</Title>
             </Group>
             <Button variant="subtle" size="xs" leftSection={<IconPlus size={14}/>}>Add Vendor</Button>
          </Group>
          <Collapse in={opened}>
            <Group align="flex-end" mt="md">
              <TextInput label="Name" placeholder="TechCorp" value={newVendorName} onChange={(e)=>setNewVendorName(e.target.value)} />
              <TextInput label="Email" placeholder="vendor@gmail.com" value={newVendorEmail} onChange={(e)=>setNewVendorEmail(e.target.value)} />
              <Button onClick={addVendor}>Save</Button>
            </Group>
          </Collapse>
          
          <Text size="xs" c="dimmed" mt="sm">
            Current Vendors: {vendors.map(v => v.name).join(', ')}
          </Text>
        </Card>
        
        {/* --- SECTION 1: CREATE RFP --- */}
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Group mb="md">
            <ThemeIcon color="blue" variant="light"><IconRobot size={20}/></ThemeIcon>
            <Title order={3}>1. Define Requirement</Title>
          </Group>
          
          <Textarea 
            placeholder="I need 20 Dell Laptops and 50 Keyboards. Budget is $40k. Need them by next Friday." 
            label="What do you need to buy?"
            minRows={3}
            value={rfpText}
            onChange={(e) => setRfpText(e.currentTarget.value)}
          />
          
          <Button mt="md" size="md" fullWidth onClick={createRfpAndSend} loading={loading}>
            Generate RFP & Email Vendors
          </Button>

          {currentRfp && (
            <Alert color="green" mt="lg" title="RFP Active" icon={<IconCheck size={16}/>}>
               <Text size="sm"><b>Items:</b> {currentRfp.structuredData?.items?.join(', ')}</Text>
               <Text size="sm"><b>Budget:</b> ${currentRfp.structuredData?.budget?.toLocaleString()}</Text>
               <Text size="sm" c="blue" mt="xs">{emailStatus}</Text>
            </Alert>
          )}
        </Card>

        {/* --- SECTION 2: VENDOR COMMUNICATION --- */}
        {currentRfp && (
          <Card shadow="sm" p="xl" radius="md" withBorder style={{ opacity: currentRfp ? 1 : 0.5 }}>
            <Group mb="md"><ThemeIcon color="orange" variant="light"><IconMail size={20}/></ThemeIcon><Title order={3}>2. Vendor Communication</Title></Group>
            <Button variant="outline" color="orange" fullWidth size="md" onClick={syncEmails} loading={syncLoading}>
              Check Inbox for Vendor Replies
            </Button>
          </Card>
        )}

        {/* --- SECTION 3: AI COMPARISON --- */}
        {verdict && (
          <Card shadow="md" p="xl" radius="md" withBorder style={{ borderColor: '#228be6', borderWidth: 2 }}>
            <Group justify="space-between" mb="md">
              <Title order={2}>AI Recommendation</Title>
              <Badge size="xl" color={verdict.score > 80 ? 'green' : 'yellow'}>Score: {verdict.score}/100</Badge>
            </Group>
            <Text size="xl" fw={700} c="blue" ta="center" my="sm">🏆 {verdict.recommendedVendor}</Text>
            <Card withBorder radius="md" p="md" bg="gray.0" mb="xl"><Text style={{ fontStyle: 'italic' }}>"{verdict.reason}"</Text></Card>
            <Table striped highlightOnHover withTableBorder>
              <thead><tr><th>Vendor</th><th>Price</th><th>Delivery</th><th>Warranty</th></tr></thead>
              <tbody>
                {proposals.map((p: any) => (
                  <tr key={p._id}>
                    <td>{p.vendorName.split('<')[0]}</td>
                    <td>${p.price?.toLocaleString()}</td>
                    <td>{p.deliveryDate}</td>
                    <td>{p.warranty}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        )}

      </Stack>
    </Container>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { 
  Container, Title, Text, Textarea, Button, Card, Group, Badge, Table, Stack, Alert, Grid, ThemeIcon
} from '@mantine/core';
import { IconCheck, IconMail, IconRobot, IconCpu } from '@tabler/icons-react';

// --- CONFIGURATION ---
const API_URL = 'http://127.0.0.1:5001';

function App() {
  // State
  const [rfpText, setRfpText] = useState('');
  const [currentRfp, setCurrentRfp] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]); // Store vendors here
  const [proposals, setProposals] = useState<any[]>([]);
  const [verdict, setVerdict] = useState<any>(null);
  
  const [loading, setLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string>(''); // To show "Sent to 3 vendors"
  const [syncLoading, setSyncLoading] = useState(false);

  // 1. Fetch Vendors on Load (So we know who to email)
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${API_URL}/vendors`);
        const data = await res.json();
        setVendors(data);
      } catch (err) {
        console.error('Failed to load vendors', err);
      }
    };
    fetchVendors();
  }, []);

  // STEP 1: Create RFP & AUTOMATICALLY Send Emails
  const createRfpAndSend = async () => {
    if (!rfpText) return;
    setLoading(true);
    setEmailStatus(''); 

    try {
      // A. Create the RFP
      const createRes = await fetch(`${API_URL}/rfps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rfpText }),
      });
      const rfpData = await createRes.json();
      setCurrentRfp(rfpData);
      
      // Reset downstream state
      setProposals([]);
      setVerdict(null);

      // B. Automate Email Sending (The missing piece!)
      if (vendors.length > 0) {
        const vendorIds = vendors.map(v => v._id);
        
        await fetch(`${API_URL}/rfps/${rfpData._id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorIds }),
        });
        
        setEmailStatus(`Successfully emailed ${vendors.length} vendor(s).`);
      } else {
        setEmailStatus('No vendors found in database to email.');
      }

    } catch (err) {
      alert('Error connecting to Backend. Is it running on port 5001?');
    }
    setLoading(false);
  };

  // STEP 2 & 3: Sync Emails & Get Comparison
  const syncEmails = async () => {
    setSyncLoading(true);
    try {
      // 1. Trigger the Email Sync (Read Inbox)
      const res = await fetch(`${API_URL}/proposals/sync`, { method: 'POST' });
      const data = await res.json();
      
      // 2. Fetch the updated Comparison logic (AI Judge)
      if (currentRfp?._id) {
        const compRes = await fetch(`${API_URL}/rfps/${currentRfp._id}/comparison`);
        const compData = await compRes.json();
        
        // Update state
        if (compData.proposals) setProposals(compData.proposals);
        if (compData.aiRecommendation) setVerdict(compData.aiRecommendation);
        
        if (data.processedCount > 0) {
           alert(`Found ${data.processedCount} new email(s)!`);
        } else {
           alert('No new emails found. Did you reply to the email yet?');
        }
      }
    } catch (err) {
      console.error(err);
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
        
        {/* --- SECTION 1: CREATE RFP --- */}
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Group mb="md">
            <ThemeIcon color="blue" variant="light"><IconRobot size={20}/></ThemeIcon>
            <Title order={3}>1. Define Requirement</Title>
          </Group>
          
          <Textarea 
            placeholder="e.g. I need 20 Dell Laptops and 50 Keyboards. Budget is $40k. Need them by next Friday." 
            label="What do you need to buy?"
            minRows={3}
            size="md"
            value={rfpText}
            onChange={(e) => setRfpText(e.currentTarget.value)}
          />
          
          <Button mt="md" size="md" fullWidth onClick={createRfpAndSend} loading={loading}>
            Generate RFP & Email Vendors
          </Button>

          {currentRfp && (
            <Alert color="green" mt="lg" title="RFP Created & Active" icon={<IconCheck size={16}/>}>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" fw={700}>Parsed Items:</Text>
                  <Text size="sm">{currentRfp.structuredData?.items?.join(', ') || 'None'}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" fw={700}>Budget:</Text>
                  <Text size="sm">${currentRfp.structuredData?.budget?.toLocaleString()}</Text>
                </Grid.Col>
              </Grid>
              
              <Text size="sm" mt="sm" fw={700} c="dimmed">Status Update:</Text>
              <Text size="sm" c="blue">{emailStatus}</Text>

              <Text size="xs" c="dimmed" mt="xs">RFP ID: {currentRfp._id}</Text>
            </Alert>
          )}
        </Card>

        {/* --- SECTION 2: VENDOR COMMUNICATION --- */}
        {currentRfp && (
          <Card shadow="sm" p="xl" radius="md" withBorder style={{ opacity: currentRfp ? 1 : 0.5 }}>
            <Group mb="md">
              <ThemeIcon color="orange" variant="light"><IconMail size={20}/></ThemeIcon>
              <Title order={3}>2. Vendor Communication</Title>
            </Group>

            {emailStatus.includes('Successfully') ? (
              <Alert color="blue" icon={<IconMail size={16}/>} mb="md">
                <Text size="sm">
                  Emails have been sent to <b>{vendors.length} registered vendors</b>. 
                  Now, please simulate a vendor response by replying to one of those emails from your phone/laptop.
                </Text>
              </Alert>
            ) : (
              <Text c="dimmed" mb="lg">Waiting for emails to be sent...</Text>
            )}
            
            <Button 
              variant="outline" 
              color="orange" 
              fullWidth 
              size="md"
              onClick={syncEmails} 
              loading={syncLoading}
            >
              Check Inbox for Vendor Replies
            </Button>
          </Card>
        )}

        {/* --- SECTION 3: AI COMPARISON --- */}
        {verdict && (
          <Card shadow="md" p="xl" radius="md" withBorder style={{ borderColor: '#228be6', borderWidth: 2 }}>
            <Group justify="space-between" mb="md">
              <Group>
                 <ThemeIcon color="green" variant="filled" size="lg"><IconCheck size={20}/></ThemeIcon>
                 <Title order={2}>AI Recommendation</Title>
              </Group>
              <Badge size="xl" color={verdict.score > 80 ? 'green' : 'yellow'}>
                Score: {verdict.score}/100
              </Badge>
            </Group>

            <Text size="xl" fw={700} c="blue" ta="center" my="sm">
              🏆 Winner: {verdict.recommendedVendor}
            </Text>
            
            <Card withBorder radius="md" p="md" bg="gray.0" mb="xl">
               <Text style={{ fontStyle: 'italic' }}>
                 "{verdict.reason}"
               </Text>
            </Card>

            <Title order={4} mb="sm">Comparison Table</Title>
            <Table striped highlightOnHover withTableBorder>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Price Quote</th>
                  <th>Delivery Date</th>
                  <th>Warranty</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p: any) => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 500 }}>{p.vendorName.split('<')[0]}</td>
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

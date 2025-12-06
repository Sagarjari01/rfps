import { Button, Collapse, Group, TextInput } from '@mantine/core';
import { useState } from 'react';

interface VendorFormProps {
  opened: boolean;
  onAdd: (name: string, email: string) => void;
}

export const VendorForm = ({ opened, onAdd }: VendorFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSave = () => {
    if (name && email) {
      onAdd(name, email);
      setName('');
      setEmail('');
    }
  };

  return (
    <Collapse in={opened}>
      <Group align="flex-end" mt="lg" gap="md">
        <TextInput 
          label="Vendor Name" 
          placeholder="TechCorp Inc." 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ flex: 1 }}
          size="md"
          radius="md"
        />
        <TextInput 
          label="Vendor Email" 
          placeholder="contact@techcorp.com" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ flex: 1 }}
          size="md"
          radius="md"
          type="email"
        />
        <Button 
          onClick={handleSave}
          variant="gradient"
          gradient={{ from: 'violet', to: 'purple', deg: 45 }}
          size="md"
          style={{
            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
            fontWeight: 600,
          }}
        >
          Save Vendor
        </Button>
      </Group>
    </Collapse>
  );
};


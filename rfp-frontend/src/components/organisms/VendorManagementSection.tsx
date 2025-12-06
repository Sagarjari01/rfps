import { Button, Card, Group, Text } from '@mantine/core';
import { IconPlus, IconUser } from '@tabler/icons-react';
import { SectionTitle } from '../atoms/SectionTitle';
import { VendorForm } from '../molecules/VendorForm';
import type { Vendor } from '../../types';

interface Props {
  vendors: Vendor[];
  formOpened: boolean;
  onToggleForm: () => void;
  onAddVendor: (name: string, email: string) => void;
}

export const VendorManagementSection = ({ vendors, formOpened, onToggleForm, onAddVendor }: Props) => {
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
      <Group justify="space-between" onClick={onToggleForm} style={{cursor: 'pointer'}}>
         <SectionTitle icon={IconUser} color="violet" title={`Registered Vendors (${vendors.length})`} />
         <Button 
           variant="gradient" 
           gradient={{ from: 'violet', to: 'purple', deg: 45 }}
           size="sm" 
           leftSection={<IconPlus size={16}/>}
           style={{
             boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)',
           }}
         >
           Add Vendor
         </Button>
      </Group>
      <VendorForm opened={formOpened} onAdd={onAddVendor} />
      <Text size="sm" c="dimmed" mt="md" fw={500}>
        {vendors.length > 0 ? (
          <span>
            Current vendors: <span style={{ color: '#7c3aed', fontWeight: 600 }}>
              {vendors.map(v => v.name).join(', ')}
            </span>
          </span>
        ) : (
          'No vendors registered yet. Add your first vendor to get started!'
        )}
      </Text>
    </Card>
  );
};


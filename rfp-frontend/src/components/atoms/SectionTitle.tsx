import { Group, ThemeIcon, Title } from '@mantine/core';
import type { ElementType } from 'react';

interface SectionTitleProps {
  icon: ElementType<{ size?: number | string; [key: string]: any }>;
  color: string;
  title: string;
}

export const SectionTitle = ({ icon: Icon, color, title }: SectionTitleProps) => (
  <Group mb="lg" gap="md">
    <ThemeIcon 
      color={color} 
      variant="gradient"
      gradient={color === 'violet' ? 
        { from: 'violet', to: 'purple', deg: 45 } :
        color === 'orange' ?
        { from: 'orange', to: 'red', deg: 45 } :
        { from: 'gray', to: 'dark', deg: 45 }
      }
      size={48}
      radius="xl"
      style={{
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
      }}
    >
      <Icon size={24} />
    </ThemeIcon>
    <Title 
      order={3}
      style={{
        fontSize: '24px',
        fontWeight: 700,
        color: '#1e293b',
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </Title>
  </Group>
);


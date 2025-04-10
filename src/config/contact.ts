export interface ContactInfo {
  icon: string;
  title: string;
  lines: string[];
}

export const contactCards: ContactInfo[] = [
  {
    icon: 'location_on',
    title: 'Ubicación',
    lines: ['Calle 123 #45-67', 'Bogotá, Colombia']
  },
  {
    icon: 'phone',
    title: 'Teléfono',
    lines: ['+57 (1) 123 4567', '+57 300 123 4567']
  },
  {
    icon: 'email',
    title: 'Email',
    lines: ['info@redglobal.com', 'ventas@redglobal.com']
  },
  {
    icon: 'schedule',
    title: 'Horario',
    lines: ['Lunes a Viernes', '8:00 AM - 6:00 PM']
  }
];

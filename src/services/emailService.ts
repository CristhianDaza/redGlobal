import type { EmailData, EmailQuoteData } from '@/types/config.d';

import emailjs from '@emailjs/browser';
import { NotificationService } from '@/components/Notification/NotificationService';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export const emailService = {
  async sendContactEmail(data: EmailData): Promise<void> {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company || 'No especificada',
          message: data.message,
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      NotificationService.push({
        title: 'Mensaje enviado',
        description: 'Tu mensaje ha sido enviado con éxito',
        type: 'success'
      });
    } catch (error) {
      NotificationService.push({
        title: 'Error al enviar el mensaje',
        description: 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.',
        type: 'error'
      });
      console.error('Error sending email:', error);
    }
  },

  async sendQuote(data: EmailQuoteData): Promise<void> {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_QUOTE_ID,
        {
          name: data.name,
          email: data.email,
          to_email: import.meta.env.VITE_EMAILJS_TO_EMAIL,
          id: data.id,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error('Error sending email:', error);
 }
  }
};

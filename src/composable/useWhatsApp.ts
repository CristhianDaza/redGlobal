import { computed } from 'vue';
import { CONSTANTS, transformColPhone } from '@/utils';

export function useWhatsApp() {
    const whatsAppLink = computed(() => {
        const phoneNumber = transformColPhone(CONSTANTS.NUMBER_WHATSAPP, true);
        const defaultMessage = CONSTANTS.MESSAGE_WHATSAPP;
        return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    });

    return {
        whatsAppLink
    }
}

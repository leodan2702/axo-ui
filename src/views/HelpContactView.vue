<template>
  <OrgHelpSection
    title="Help"
    subtitle=""
    appName="Axo Platform"
    :version="appVersion"
    orgName="Mistix"
    legalNote=""
    :links="contactLinks"
    tVersion="Version"
    tContactUs="Contact us"
    :contactIntro="contactIntro"
  />
</template>

<script setup>
import OrgHelpSection from '@/components/OrgHelpSection.vue'

// Version: if you're using Vite, you can inject it from import.meta.env or package.json


// Short text displayed under “Contact us”
const contactIntro =
  'We are here to help you. Feel free to reach out or explore the available resources.'

// Links (same layout as WhatsApp, but with your branding)
const contactLinks = [
  {
    text: 'Contact us',
    icon: 'mdi-email-outline',
    href: 'mailto:contact@mistix.com.mx'
  },
  {
    text: 'Rate the application',
    icon: 'mdi-star-outline',
    href: 'https://forms.gle/tu-form'
  },
  {
    text: 'Help Center',
    icon: 'mdi-lifebuoy',
    to: '/faq'
  },
  {
    text: 'Licenses',
    icon: 'mdi-certificate-outline',
    to: '/licenses'
  },
  {
    text: 'Terms and Privacy Policy',
    icon: 'mdi-file-document-outline',
    to: '/legal/terms'
  },
  {
    text: 'Support via WhatsApp',
    icon: 'mdi-whatsapp',
    href: 'https://wa.me/4811095288'
  },
  {
    text: 'Help Desk',
    icon: 'mdi-headset',
    href: 'https://mistix.com.mx'
  },
  {
    text: 'GitHub Repository',
    icon: 'mdi-github',
    href: 'https://github.com/muyal-research-group/axo-ui'
  }
]
</script>

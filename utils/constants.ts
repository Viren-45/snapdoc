//utils/constants.ts
import { isDev } from "@/utils/helpers";

export const pricingPlans = [
  {
      name: 'Basic',
      price: 9,
      description: 'Perfect for occasional use ',
      items: [
          '3 PDF summaries per month',
          'Standard processing speed',
          'Email support',
      ],
      id: 'basic',
      //todo: update url
      paymentLink: isDev ? 'https://buy.stripe.com/test_fZeeVKdmrenm3a8bII?redirect=true&success_url=https://localhost:3000' : '',
      priceId: isDev ? 'price_1RMuVc1mxi2iZqYwPjqbZVSg' : ''
  },
  {
      name: 'Pro',
      price: 19,
      description: 'For professionals and teams',
      items: [
          'Unlimited PDF summaries',
          'Priority processing',
          '24/7 priority support',
          'Markdown Export'
      ],
      id: 'pro',
      //todo: update url
      paymentLink: isDev ? 'https://buy.stripe.com/test_cN2dRGbejdji9yw3cd?redirect=true&success_url=https://localhost:3000' : '',
      priceId: isDev ? 'price_1RMuYz1mxi2iZqYwcT5yGnrD' : ''
  }
]

export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };
  
  export const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 50,
        duration: 0.8,
      },
    },
  };
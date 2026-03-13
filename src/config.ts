export interface PaymentMethod {
  enabled: boolean;
  handle?: string;
  email?: string;
  note?: string;
  paymentLink?: string;
}

export interface FundConfig {
  // Couple info
  coupleName: string;
  weddingDate: string;
  heroImage: string;
  message: string;

  // Fund
  fund: {
    title: string;
    description: string;
    goalAmount: number;
    currentAmount: number;
  };

  // Payment methods
  payments: {
    venmo: PaymentMethod;
    zelle: PaymentMethod;
    cashapp: PaymentMethod;
    stripe: PaymentMethod;
  };

  // Theming
  theme: {
    primaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
}

export const config: FundConfig = {
  // Couple info
  coupleName: "Alex & Jack",
  weddingDate: "June 21, 2026",
  heroImage: "/images/couple.jpg",
  message:
    "We're so excited to celebrate with you! In lieu of traditional gifts, we'd love your help making our dream honeymoon a reality.",

  // Fund
  fund: {
    title: "Our Honeymoon Fund",
    description: "Help us explore South America for 1 month!",
    goalAmount: 0,
    currentAmount: 0,
  },

  // Payment methods
  payments: {
    venmo: {
      enabled: true,
      handle: process.env.NEXT_PUBLIC_VENMO_HANDLE ?? "",
      note: "Honeymoon Fund",
    },
    zelle: {
      enabled: true,
      email: process.env.NEXT_PUBLIC_ZELLE_EMAIL ?? "",
    },
    cashapp: {
      enabled: false,
      handle: process.env.NEXT_PUBLIC_CASHAPP_HANDLE ?? "",
    },
    stripe: {
      enabled: true,
      paymentLink: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? "",
    },
  },

  // Theming
  theme: {
    primaryColor: "#8B7355",
    backgroundColor: "#FAFAF8",
    fontFamily: "serif",
  },
};

export const CATEGORY_METADATA = {
  ORDER: {
    name: "Orders & Purchases",
    department: "Fulfillment & Orders Desk",
    priority: "Medium",
    sla: "2 hours",
    color: "#3B82F6",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description: "Order placement, modifications, item substitutions, and live tracking inquiries."
  },
  CANCEL: {
    name: "Cancellations",
    department: "Retention & Cancellation Unit",
    priority: "High",
    sla: "1 hour",
    color: "#EF4444",
    badgeClass: "bg-red-500/10 text-red-400 border-red-500/20",
    description: "Contract withdrawal, termination fees, and time-critical cancellation requests."
  },
  REFUND: {
    name: "Refunds & Reimbursements",
    department: "Billing & Financial Operations",
    priority: "High",
    sla: "2 hours",
    color: "#F59E0B",
    badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    description: "Reimbursement requests, refund status checks, and policy clarifications."
  },
  PAYMENT: {
    name: "Payments & Billing",
    department: "Payment Gateway & Security",
    priority: "High",
    sla: "1 hour",
    color: "#10B981",
    badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    description: "Declined transactions, payment modalities, chargebacks, and checkout issues."
  },
  DELIVERY: {
    name: "Delivery & Logistics",
    department: "Logistics & Carrier Support",
    priority: "Medium",
    sla: "4 hours",
    color: "#6366F1",
    badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    description: "Estimated arrival dates, courier delays, and express delivery options."
  },
  SHIPPING: {
    name: "Shipping & Addresses",
    department: "Address Verification & Dispatch",
    priority: "Medium",
    sla: "4 hours",
    color: "#8B5CF6",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Dispatch locations, destination updates, and international delivery setup."
  },
  INVOICE: {
    name: "Invoicing & Receipts",
    department: "Accounting & Invoicing",
    priority: "Low",
    sla: "12 hours",
    color: "#64748B",
    badgeClass: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    description: "VAT invoices, PDF receipts, billing discrepancies, and expense reporting."
  },
  ACCOUNT: {
    name: "Account & Profile",
    department: "Identity & Security Support",
    priority: "High",
    sla: "2 hours",
    color: "#06B6D4",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    description: "Registration problems, password recovery, profile edits, and multi-account switching."
  },
  FEEDBACK: {
    name: "Feedback & Complaints",
    department: "Customer Experience & QA",
    priority: "Medium",
    sla: "12 hours",
    color: "#EC4899",
    badgeClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    description: "Product reviews, complaints regarding service quality, and satisfaction feedback."
  },
  CONTACT: {
    name: "Live Contact & Escalation",
    department: "Live Agent Escalation Hub",
    priority: "Critical",
    sla: "15 minutes",
    color: "#F97316",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    description: "Direct requests to speak with a human support agent or supervisor."
  },
  SUBSCRIPTION: {
    name: "Subscriptions & Newsletters",
    department: "Marketing & Communications",
    priority: "Low",
    sla: "24 hours",
    color: "#14B8A6",
    badgeClass: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    description: "Newsletter preference management, subscription opt-ins, and opt-outs."
  }
};

export const INTENTS_CATALOG = [
  {
    intent: "cancel_order",
    label: "Cancel Order",
    category: "ORDER",
    description: "Customer wants to stop, cancel, or void an active order.",
    samples: [
      "want help to cancel order {{Order Number}}",
      "I do not want my last item, please cancel order {{Order Number}}",
      "i have a question about cancelling order {{Order Number}}"
    ]
  },
  {
    intent: "change_order",
    label: "Change Order",
    category: "ORDER",
    description: "Customer needs to modify items, quantities, or details of an existing purchase.",
    samples: [
      "i need help changing some articles of order {{Order Number}}",
      "I want to change purchase {{Order Number}} to different size",
      "how do I correct purchase {{Order Number}}?"
    ]
  },
  {
    intent: "place_order",
    label: "Place Order",
    category: "ORDER",
    description: "Customer needs assistance creating a new purchase or adding items to cart.",
    samples: [
      "i have got to buy some items how can i do it",
      "need support to place a new order for electronics",
      "help me proceed to checkout and finalize my purchase"
    ]
  },
  {
    intent: "track_order",
    label: "Track Order",
    category: "ORDER",
    description: "Customer inquires about the current status or tracking information of an order.",
    samples: [
      "i need to check where my order {{Order Number}} is right now",
      "how do i track package {{Order Number}}?",
      "where can I follow the progress of my shipment?"
    ]
  },
  {
    intent: "check_cancellation_fee",
    label: "Check Cancellation Fee",
    category: "CANCEL",
    description: "Customer asks about monetary penalties or charges associated with cancelling.",
    samples: [
      "where do i check the cancellation penalty",
      "can i see the early termination fees before cancelling?",
      "could you help me see the withdrawal charges?"
    ]
  },
  {
    intent: "change_shipping_address",
    label: "Change Shipping Address",
    category: "SHIPPING",
    description: "Customer requests updating the destination street or city for an order.",
    samples: [
      "supports trying to update my address for order {{Order Number}}",
      "where can i get information about editing the shipping address",
      "i have issues editing the address before the package departs"
    ]
  },
  {
    intent: "set_up_shipping_address",
    label: "Set Up Shipping Address",
    category: "SHIPPING",
    description: "Customer configuring their primary or secondary delivery destination.",
    samples: [
      "how do i add a secondary delivery address to my account?",
      "need help entering my residential shipping destination",
      "steps to establish a default dispatch address"
    ]
  },
  {
    intent: "check_invoice",
    label: "Check Invoice",
    category: "INVOICE",
    description: "Customer reviews line items, tax numbers, or totals on an existing invoice.",
    samples: [
      "I have got to take a quick look at my invoice #37777",
      "i have got to check the invoices from last month",
      "i do not know what to do to look for my bill #00108"
    ]
  },
  {
    intent: "get_invoice",
    label: "Get Invoice",
    category: "INVOICE",
    description: "Customer requests a PDF download or email copy of a billing statement.",
    samples: [
      "please send me the official PDF invoice for order {{Order Number}}",
      "how can i download my commercial receipt for tax purposes?",
      "i need a copy of my recent transaction bill sent to my email"
    ]
  },
  {
    intent: "check_payment_methods",
    label: "Check Payment Methods",
    category: "PAYMENT",
    description: "Customer asks which payment cards, digital wallets, or currencies are supported.",
    samples: [
      "help me check ur allowed payment modalities",
      "assistance to check what payment methods you accept",
      "how to check if you accept PayPal or American Express?"
    ]
  },
  {
    intent: "payment_issue",
    label: "Payment Issue",
    category: "PAYMENT",
    description: "Customer reports a failed checkout, double charge, or card validation error.",
    samples: [
      "my card was charged twice for transaction {{Order Number}}",
      "payment keeps getting rejected during final checkout",
      "there is an unexpected error processing my credit card"
    ]
  },
  {
    intent: "check_refund_policy",
    label: "Check Refund Policy",
    category: "REFUND",
    description: "Customer inquires about refund terms, return windows, or product eligibility.",
    samples: [
      "help checking in which cases can I ask for reimbursements",
      "I try to see in which situations can I request a reimbursement",
      "what is the official timeline and terms for getting my money back?"
    ]
  },
  {
    intent: "get_refund",
    label: "Get Refund",
    category: "REFUND",
    description: "Customer formally requests monetary reimbursement for returned or defective goods.",
    samples: [
      "i returned the damaged item and want my money refunded now",
      "help me start a reimbursement claim for purchase {{Order Number}}",
      "i want my money back for the cancelled booking"
    ]
  },
  {
    intent: "track_refund",
    label: "Track Refund",
    category: "REFUND",
    description: "Customer checks whether an approved refund has cleared back to their account.",
    samples: [
      "how long until the refund appears on my bank statement?",
      "can i track the status of my return reimbursement claim?",
      "where is the money that was promised to be refunded 5 days ago?"
    ]
  },
  {
    intent: "delivery_period",
    label: "Delivery Period",
    category: "DELIVERY",
    description: "Customer asks how many days or hours until their parcel is expected to arrive.",
    samples: [
      "help me to see how long it takes for the article to arrive",
      "assistance to check how soon can i expect the order",
      "how many working days does standard delivery usually take?"
    ]
  },
  {
    intent: "delivery_options",
    label: "Delivery Options",
    category: "DELIVERY",
    description: "Customer compares standard, express, overnight, or pickup locker options.",
    samples: [
      "what shipping and delivery speeds are available for my zone?",
      "can i choose weekend or evening delivery slots?",
      "is same-day courier dispatch supported in my area?"
    ]
  },
  {
    intent: "complaint",
    label: "Customer Complaint",
    category: "FEEDBACK",
    description: "Customer expresses dissatisfaction with product quality, courier, or support.",
    samples: [
      "i want to file a formal complaint regarding terrible service",
      "the product arrived in shattered pieces and your support ignored me",
      "submitting an official grievance about an unprofessional delivery driver"
    ]
  },
  {
    intent: "review",
    label: "Product / Service Review",
    category: "FEEDBACK",
    description: "Customer wants to submit a rating, testimonial, or review for a purchased product.",
    samples: [
      "where do i leave a 5-star rating for the product i received?",
      "how can i post an honest review on the product catalog page?",
      "i want to rate my customer service representative"
    ]
  },
  {
    intent: "contact_human_agent",
    label: "Contact Human Agent",
    category: "CONTACT",
    description: "Customer insists on speaking with an actual human representative immediately.",
    samples: [
      "I need help to talk to a person right now",
      "transfer me to a real human representative, not a system",
      "i need to speak with a live support agent immediately"
    ]
  },
  {
    intent: "contact_customer_service",
    label: "Contact Customer Service",
    category: "CONTACT",
    description: "Customer looks for phone numbers, support emails, or office hours.",
    samples: [
      "what is the toll-free telephone number for customer support?",
      "how can i reach out to the help desk team via email?",
      "are support representatives reachable on weekends?"
    ]
  },
  {
    intent: "create_account",
    label: "Create Account",
    category: "ACCOUNT",
    description: "Customer asks how to register a personal or business account.",
    samples: [
      "can you give me information about opening {{Account Type}} accounts?",
      "I don't know what I have to do to create a {{Account Category}} account",
      "walk me through the steps to register a new user profile"
    ]
  },
  {
    intent: "delete_account",
    label: "Delete Account",
    category: "ACCOUNT",
    description: "Customer wants to permanently erase their profile and associated data.",
    samples: [
      "how do i permanently close and delete my account?",
      "i want all my personal information and account erased",
      "where is the option to terminate my profile forever?"
    ]
  },
  {
    intent: "edit_account",
    label: "Edit Account",
    category: "ACCOUNT",
    description: "Customer wants to update their name, phone number, or account credentials.",
    samples: [
      "I don't know how to correct the data included on my account",
      "how do i update my registered phone number and legal name?",
      "need to modify profile details in my user settings"
    ]
  },
  {
    intent: "recover_password",
    label: "Recover Password",
    category: "ACCOUNT",
    description: "Customer forgot their password or cannot log in due to lost credentials.",
    samples: [
      "i forgot my login passcode and cannot sign into my profile",
      "send a password reset link to my registered email address",
      "locked out of my account because my password is not accepted"
    ]
  },
  {
    intent: "registration_problems",
    label: "Registration Problems",
    category: "ACCOUNT",
    description: "Customer encounters verification code errors or form blocks during sign-up.",
    samples: [
      "I can't notify of problems with a registration",
      "the verification SMS code never arrives when trying to sign up",
      "getting an error saying my email is already in use during registration"
    ]
  },
  {
    intent: "switch_account",
    label: "Switch Account",
    category: "ACCOUNT",
    description: "Customer wants to toggle between business, personal, or multiple profiles.",
    samples: [
      "how can i toggle between my personal account and company account?",
      "is it possible to switch profiles without logging out completely?",
      "steps to link and switch between two separate accounts"
    ]
  },
  {
    intent: "newsletter_subscription",
    label: "Newsletter Subscription",
    category: "SUBSCRIPTION",
    description: "Customer wants to manage promotional newsletter emails or unsubscribe.",
    samples: [
      "how do i unsubscribe from the weekly promotional newsletter?",
      "i want to sign up for discount alert emails and newsletters",
      "change my email preferences to stop promotional mailings"
    ]
  }
];

export const SYSTEM_BENCHMARK = {
  model_name: "LinearSVC (Char TF-IDF ∪ Word2Vec 128-d)",
  accuracy: "99.84%",
  macro_f1: "0.9980",
  weighted_f1: "0.9984",
  test_errors: "4 out of 2,428 samples",
  dataset_size: "24,274 deduplicated support tickets",
  vocabulary_features: "10,234 features",
  categories_count: 11,
  intents_count: 27,
  splits: {
    train: 19419,
    val: 2427,
    test: 2428
  },
  features_composition: [
    { name: "Character n-grams (2,5) TF-IDF", count: 10106, description: "Typo-robust subword features that handle typos and misspellings" },
    { name: "Word2Vec 128-d (Mean-Pooled)", count: 128, description: "Dense semantic embeddings capturing semantic context and synonyms" }
  ],
  models_comparison: [
    {
      name: "LinearSVC (Champion)",
      features: "Char TF-IDF ∪ Word2Vec",
      macro_f1: 0.9980,
      accuracy: 0.9984,
      latency: "1.2 ms",
      badge: "Production Active"
    },
    {
      name: "LinearSVC (Baseline)",
      features: "Word + Char TF-IDF",
      macro_f1: 0.9972,
      accuracy: 0.9975,
      latency: "1.5 ms",
      badge: "Evaluated"
    },
    {
      name: "Logistic Regression",
      features: "Char TF-IDF ∪ Word2Vec",
      macro_f1: 0.9928,
      accuracy: 0.9934,
      latency: "1.8 ms",
      badge: "Evaluated"
    },
    {
      name: "Complement Naive Bayes",
      features: "Char TF-IDF Only",
      macro_f1: 0.9395,
      accuracy: 0.9412,
      latency: "0.9 ms",
      badge: "Evaluated"
    }
  ]
};



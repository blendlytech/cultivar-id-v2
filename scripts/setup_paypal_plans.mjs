// scripts/setup_paypal_plans.mjs
import fetch from 'node-fetch';

// Use environment variables for PayPal credentials
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
  console.error("Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET in environment variables.");
  process.exit(1);
}

const BASE_URL = 'https://api-m.paypal.com'; // LIVE URL

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const data = await response.json();
  return data.access_token;
}

async function createProduct(token) {
  const response = await fetch(`${BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Rare Plant Vendors Platform',
      description: 'Vendor Subscription Tiers for Rare Plant Vendors Directory',
      type: 'DIGITAL',
      category: 'SOFTWARE',
    }),
  });
  const data = await response.json();
  return data.id;
}

async function createPlan(token, productId, name, description, price, interval) {
  const response = await fetch(`${BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product_id: productId,
      name: name,
      description: description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: interval === 'MONTH' ? 'MONTH' : 'YEAR',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  });
  const data = await response.json();
  return data.id;
}

async function setup() {
  try {
    console.log('🔑 Authenticating with PayPal...');
    const token = await getAccessToken();
    
    console.log('📦 Creating Product...');
    const productId = await createProduct(token);
    console.log(`✅ Product Created: ${productId}`);

    const plans = [
      { name: 'Verified Grower (Monthly)', price: '29.00', interval: 'MONTH' },
      { name: 'Verified Grower (Annual)', price: '299.00', interval: 'YEAR' },
      { name: 'Pro Grower (Monthly)', price: '59.00', interval: 'MONTH' },
      { name: 'Pro Grower (Annual)', price: '599.00', interval: 'YEAR' },
    ];

    const results = {};
    for (const p of plans) {
      console.log(`🕒 Creating Plan: ${p.name}...`);
      const planId = await createPlan(token, productId, p.name, p.name, p.price, p.interval);
      results[p.name] = planId;
      console.log(`✅ ${p.name} ID: ${planId}`);
    }

    console.log('\n🚀 ALL PLANS CREATED SUCCESSFULLY!');
    console.log(JSON.stringify(results, null, 2));
  } catch (error) {
    console.error('❌ Error during setup:', error);
  }
}

setup();

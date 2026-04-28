const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Pagamento confirmado — ativar plano
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;

    if (userId) {
      const { error } = await sb.from('profiles').update({
        plan: 'pro',
        status: 'active',
        updated_at: new Date().toISOString()
      }).eq('id', userId);

      if (error) {
        console.error('Supabase update error:', error);
        return res.status(500).json({ error: 'Failed to activate plan' });
      }

      console.log(`✅ Plan activated for user: ${userId}`);
    }
  }

  // Subscrição cancelada — desativar plano
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    // Encontrar utilizador pelo customer ID
    const { data: profiles } = await sb
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId);

    if (profiles && profiles.length > 0) {
      await sb.from('profiles').update({
        plan: 'free',
        status: 'pending',
        updated_at: new Date().toISOString()
      }).eq('id', profiles[0].id);

      console.log(`❌ Plan deactivated for customer: ${customerId}`);
    }
  }

  res.status(200).json({ received: true });
};

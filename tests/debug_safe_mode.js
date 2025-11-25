const handler = require('../api/webhook');

// Mock request object
const req = {
  method: 'POST',
  body: {
    update_id: 123456789,
    message: {
      message_id: 1,
      from: { id: 123456789, is_bot: false, first_name: 'Test' },
      chat: { id: 123456789, type: 'private' },
      date: 1678900000,
      text: '/start'
    }
  }
};

// Mock response object
const res = {
  status: (code) => {
    console.log(`Response Status: ${code}`);
    return res;
  },
  send: (body) => {
    console.log(`Response Body: ${body}`);
  }
};

// Mock process.env with MISSING config
process.env.BOT_TOKEN = 'test_token';
process.env.SEPOLIA_RPC_URL = ''; // Missing RPC URL
process.env.WALLET_PRIVATE_KEY = ''; // Missing Private Key

// Run the handler
console.log('--- Simulating /start with MISSING config ---');
handler(req, res).then(() => {
  console.log('--- Handler finished ---');
});

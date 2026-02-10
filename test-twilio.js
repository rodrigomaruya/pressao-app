"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
console.log('📱 Testando Twilio...');
console.log('Account SID:', accountSid?.substring(0, 5) + '***');
console.log('Auth Token:', authToken?.substring(0, 5) + '***');
console.log('WhatsApp Number:', whatsappNumber);
if (!accountSid || !authToken) {
    console.error('❌ Credenciais do Twilio não encontradas no .env');
    process.exit(1);
}
const client = (0, twilio_1.default)(accountSid, authToken);
// Teste 1: Listar números do Twilio
console.log('\n1️⃣ Listando números do Twilio...');
client.incomingPhoneNumbers.list()
    .then(numbers => {
    console.log('✅ Números encontrados:', numbers.length);
    numbers.forEach(num => {
        console.log(`  - ${num.phoneNumber} (${num.friendlyName})`);
    });
})
    .catch(err => console.error('❌ Erro:', err.message));
// Teste 2: Listar conversas WhatsApp (se disponível)
console.log('\n2️⃣ Testando WhatsApp...');
if (whatsappNumber) {
    client.conversations.conversations.list({ limit: 5 })
        .then(conversations => {
        console.log('✅ Conversas encontradas:', conversations.length);
    })
        .catch(err => console.error('❌ Erro ao listar conversas:', err.message));
}
console.log('\n⏳ Teste concluído!');

require("dotenv").config();
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

console.log("\n🚀 Teste Completo do Twilio\n");
console.log("═".repeat(50));

// Teste 1: Informações da Conta
console.log("\n📊 1. Informações da Conta:");
console.log("─".repeat(50));
client.api
  .accounts(accountSid)
  .fetch()
  .then((account) => {
    console.log(`✅ Conta: ${account.friendlyName}`);
    console.log(`   Status: ${account.status}`);
    console.log(`   Tipo: ${account.type}`);
    console.log(`   SID: ${account.sid}`);
  })
  .catch((err) => console.error("❌ Erro:", err.message));

// Teste 2: Números Disponíveis
setTimeout(() => {
  console.log("\n📱 2. Números de Telefone Disponíveis:");
  console.log("─".repeat(50));
  client.incomingPhoneNumbers
    .list({ limit: 10 })
    .then((numbers) => {
      if (numbers.length === 0) {
        console.log("⚠️  Nenhum número configurado para enviar SMS");
        console.log("   Entre em twilio.com para comprar um número");
      } else {
        console.log(`✅ ${numbers.length} número(s) encontrado(s):`);
        numbers.forEach((num) => {
          console.log(`   • ${num.phoneNumber} (${num.friendlyName})`);
        });
      }
    })
    .catch((err) => console.error("❌ Erro:", err.message));
}, 1000);

// Teste 3: Mensagens Recentes
setTimeout(() => {
  console.log("\n💬 3. Últimas Mensagens Enviadas/Recebidas:");
  console.log("─".repeat(50));
  client.messages
    .list({ limit: 5 })
    .then((messages) => {
      if (messages.length === 0) {
        console.log("ℹ️  Nenhuma mensagem encontrada");
      } else {
        console.log(`✅ ${messages.length} mensagem(ns):`);
        messages.forEach((msg) => {
          console.log(`   • ${msg.from} → ${msg.to}`);
          console.log(`     Status: ${msg.status} | Data: ${msg.dateCreated}`);
        });
      }
    })
    .catch((err) => console.error("❌ Erro:", err.message));
}, 2000);

// Teste 4: Enviar SMS de Teste (descomente para usar)
setTimeout(() => {
  console.log("\n✉️  4. Para ENVIAR um SMS de teste:");
  console.log("─".repeat(50));
  console.log("Descomente o código abaixo e adicione seu número:");
  console.log(`
  client.messages.create({
    body: 'Teste do Twilio 🎉',
    from: '+14155238886',  // Seu número Twilio
    to: '+55XXXXXXXXXXX'   // Número para teste (seu celular)
  })
  .then(msg => console.log('SMS enviado! SID:', msg.sid))
  .catch(err => console.error('Erro:', err.message));
  `);
}, 3000);

console.log("\n═".repeat(50));
setTimeout(() => {
  console.log("\n✅ Teste concluído!\n");
}, 4000);

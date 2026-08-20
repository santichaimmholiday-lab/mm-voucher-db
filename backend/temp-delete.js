const { Client } = require('pg'); 
const client = new Client({ connectionString: 'postgresql://postgres.xmbzjgsqiakdnmuhbmvc:MMHolidays_2026@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres' }); 
client.connect().then(() => {
  client.query("DELETE FROM tb_system_settings WHERE id = 'a91777ec-82a0-40c7-be52-93e1bb617eac'").then(res => { 
    console.log('Deleted duplicate settings row'); 
    client.end(); 
  })
});

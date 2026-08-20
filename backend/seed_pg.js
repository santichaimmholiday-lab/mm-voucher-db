const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgresql://postgres.xmbzjgsqiakdnmuhbmvc:MMHolidays_2026@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function seed() {
  await client.connect();
  const users = [
    { username: 'admin', email: 'admin@mmholiday.com', role: 'Admin', password: 'password123' },
    { username: 'manager', email: 'manager@mmholiday.com', role: 'Manager', password: 'password123' },
    { username: 'staff', email: 'staff@mmholiday.com', role: 'User', password: 'password123' },
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    // Generate UUID
    const id = require('crypto').randomUUID();
    
    // Check if exists
    const res = await client.query('SELECT username FROM tb_user WHERE username = $1', [u.username]);
    if (res.rows.length === 0) {
      await client.query(
        'INSERT INTO tb_user (id, username, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [id, u.username, u.email, hashedPassword, u.role]
      );
      console.log(`Created user: ${u.username}`);
    } else {
      console.log(`User already exists: ${u.username}`);
    }
  }
}

seed().catch(console.error).finally(() => client.end());

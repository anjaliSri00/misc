const { knex } = require('./src/db/connection');

async function createSimpleUser() {
  try {
    // Check if admin user already exists
    const existingUser = await knex('users').where('email', 'admin@test.com').first();
    
    if (existingUser) {
      // Update existing user with plain text password
      await knex('users').where('email', 'admin@test.com').update({
        password: 'admin123'  // Plain text password
      });
      console.log('Admin user password updated to plain text!');
    } else {
      // Create admin user with plain text password
      const adminUser = await knex('users').insert({
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@test.com',
        mobile: '1234567890',
        password: 'admin123',  // Plain text password
        is_active: true
      }).returning('*');
      
      console.log('Admin user created successfully!');
    }
    
    console.log('Email: admin@test.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  } finally {
    // Close the database connection
    await knex.destroy();
  }
}

createSimpleUser(); 
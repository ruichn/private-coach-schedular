const bcrypt = require('bcrypt')

async function generateAdminPasswordHash() {
  // Use the current admin password from .env
  const currentPassword = 'volleyball-admin-2024'
  
  try {
    const hash = await bcrypt.hash(currentPassword, 12)
    console.log('\n=== ADMIN PASSWORD HASH ===')
    console.log('Add this to your .env file as ADMIN_PASSWORD_HASH:')
    console.log(hash)
    console.log('\nDon\'t forget to:')
    console.log('1. Remove the old ADMIN_PASSWORD from .env')
    console.log('2. Add ADMIN_PASSWORD_HASH with the hash above')
    console.log('3. Add JWT_SECRET with a secure random string')
    console.log('============================\n')
  } catch (error) {
    console.error('Error generating hash:', error)
  }
}

generateAdminPasswordHash()
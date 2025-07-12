// server/seed.ts
import bcrypt from 'bcryptjs';
import { storage } from './storage';

async function seedDatabase() {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await storage.createUserWithPassword({
      name: 'Admin User',
      email: 'admin@kalluba.com',
      bio: 'Platform administrator',
      profileImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'ADMIN',
      passwordHash: hashedPassword,
    });

    console.log('✅ Admin user created:', adminUser.email);

    // Create regular test user
    const testPassword = await bcrypt.hash('testuser123', 10);
    
    const testUser = await storage.createUserWithPassword({
      name: 'Test User',
      email: 'test@kalluba.com',
      bio: 'Test user account',
      profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'USER',
      passwordHash: testPassword,
    });

    console.log('✅ Test user created:', testUser.email);

    console.log('🎉 Database seeding completed!');
    console.log('');
    console.log('Test accounts:');
    console.log('- Admin: admin@kalluba.com / admin123');
    console.log('- User: test@kalluba.com / testuser123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

export { seedDatabase };
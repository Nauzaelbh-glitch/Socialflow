import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');
    
    await prisma.$connect();
    console.log('✅ Conexión exitosa');
    
    console.log('\n📋 Verificando tablas...');
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    console.log('Tablas encontradas:', tables);
    
    console.log('\n📊 Verificando conteo de registros...');
    
    const companyCount = await prisma.company.count();
    console.log(`Companies: ${companyCount}`);
    
    const userCount = await prisma.user.count();
    console.log(`Users: ${userCount}`);
    
    const postCount = await prisma.post.count();
    console.log(`Posts: ${postCount}`);
    
    console.log('\n✅ Base de datos verificada correctamente');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();

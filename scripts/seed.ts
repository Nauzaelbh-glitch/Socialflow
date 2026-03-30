import { PrismaClient, UserRole, Platform, AccountStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando seed de la base de datos...');

    console.log('🏢 Creando empresa de prueba...');
    const company = await prisma.company.upsert({
      where: { slug: 'socialflow-demo' },
      update: {},
      create: {
        name: 'SocialFlow Demo',
        slug: 'socialflow-demo',
        settings: {
          timezone: 'America/Mexico_City',
          language: 'es',
        },
      },
    });
    console.log(`✅ Empresa creada: ${company.name}`);

    console.log('👤 Creando usuario de prueba...');
    const hashedPassword = await bcrypt.hash('Demo123!', 12);
    
    const user = await prisma.user.upsert({
      where: { email: 'demo@socialflow.app' },
      update: {},
      create: {
        email: 'demo@socialflow.app',
        passwordHash: hashedPassword,
        firstName: 'Usuario',
        lastName: 'Demo',
        role: UserRole.ADMIN,
        companyId: company.id,
      },
    });
    console.log(`✅ Usuario creado: ${user.email}`);

    console.log('📱 Creando cuentas sociales de prueba...');
    const socialAccounts = [
      {
        companyId: company.id,
        userId: user.id,
        platform: Platform.FACEBOOK,
        platformAccountId: 'fb-12345',
        platformAccountName: 'Página Demo Facebook',
        accessTokenEncrypted: 'encrypted-token-fb',
        status: AccountStatus.ACTIVE,
      },
      {
        companyId: company.id,
        userId: user.id,
        platform: Platform.INSTAGRAM,
        platformAccountId: 'ig-67890',
        platformAccountName: 'Cuenta Demo Instagram',
        accessTokenEncrypted: 'encrypted-token-ig',
        status: AccountStatus.ACTIVE,
      },
      {
        companyId: company.id,
        userId: user.id,
        platform: Platform.LINKEDIN,
        platformAccountId: 'li-11111',
        platformAccountName: 'Empresa Demo LinkedIn',
        accessTokenEncrypted: 'encrypted-token-li',
        status: AccountStatus.ACTIVE,
      },
      {
        companyId: company.id,
        userId: user.id,
        platform: Platform.TWITTER,
        platformAccountId: 'tw-22222',
        platformAccountName: '@DemoSocialFlow',
        accessTokenEncrypted: 'encrypted-token-tw',
        status: AccountStatus.ACTIVE,
      },
      {
        companyId: company.id,
        userId: user.id,
        platform: Platform.TIKTOK,
        platformAccountId: 'tt-33333',
        platformAccountName: 'Cuenta Demo TikTok',
        accessTokenEncrypted: 'encrypted-token-tt',
        status: AccountStatus.ACTIVE,
      },
    ];

    for (const account of socialAccounts) {
      await prisma.socialAccount.upsert({
        where: {
          companyId_platform_platformAccountId: {
          companyId: account.companyId,
            platform: account.platform,
            platformAccountId: account.platformAccountId,
          },
        },
        update: {},
        create: account,
      });
    }
    console.log(`✅ ${socialAccounts.length} cuentas sociales creadas`);

    console.log('📝 Creando plantillas de prueba...');
    const templates = [
      {
        companyId: company.id,
        userId: user.id,
        name: 'Anuncio de Producto',
        description: 'Plantilla para anunciar nuevos productos',
        category: 'marketing',
        contentTemplate: {
          text: '🎉 ¡Nuevo producto! {{product_name}}\n\n{{product_description}}\n\n🛒 Compra ahora: {{product_link}}',
          hashtags: ['#NuevoProducto', '#Lanzamiento', '#Oferta'],
        },
        variables: [
          { name: 'product_name', label: 'Nombre del producto', type: 'text', required: true },
          { name: 'product_description', label: 'Descripción', type: 'textarea', required: true },
          { name: 'product_link', label: 'Enlace de compra', type: 'url', required: true },
        ],
      },
      {
        companyId: company.id,
        userId: user.id,
        name: 'Recordatorio de Evento',
        description: 'Para promocionar eventos y webinars',
        category: 'eventos',
        contentTemplate: {
          text: '📅 ¡No te pierdas nuestro {{event_type}}!\n\n📌 {{event_name}}\n📆 Fecha: {{event_date}}\n⏰ Hora: {{event_time}}\n\n👉 Regístrate aquí: {{registration_link}}',
          hashtags: ['#Evento', '#Webinar', '#Educación'],
        },
        variables: [
          { name: 'event_type', label: 'Tipo de evento', type: 'text', required: true },
          { name: 'event_name', label: 'Nombre del evento', type: 'text', required: true },
          { name: 'event_date', label: 'Fecha', type: 'date', required: true },
          { name: 'event_time', label: 'Hora', type: 'text', required: true },
          { name: 'registration_link', label: 'Enlace de registro', type: 'url', required: true },
        ],
      },
      {
        companyId: company.id,
        userId: user.id,
        name: 'Testimonio de Cliente',
        description: 'Comparte testimonios de clientes satisfechos',
        category: 'social-proof',
        contentTemplate: {
          text: '💬 "{{testimonial}}"\n\n— {{customer_name}}, {{customer_title}}',
          hashtags: ['#Testimonio', '#ClienteFeliz', '#Recomendado'],
        },
        variables: [
          { name: 'testimonial', label: 'Testimonio', type: 'textarea', required: true },
          { name: 'customer_name', label: 'Nombre del cliente', type: 'text', required: true },
          { name: 'customer_title', label: 'Cargo/Puesto', type: 'text', required: false },
        ],
      },
    ];

    for (const template of templates) {
      await prisma.template.create({
        data: template,
      });
    }
    console.log(`✅ ${templates.length} plantillas creadas`);

    console.log('📊 Creando analytics de prueba...');
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const account of socialAccounts) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        
        await prisma.accountAnalytics.create({
          data: {
            socialAccount: {
              connect: {
                companyId_platform_platformAccountId: {
                  companyId: account.companyId,
                  platform: account.platform,
                  platformAccountId: account.platformAccountId,
                },
              },
            },
            collectedAt: date,
            followersCount: Math.floor(Math.random() * 10000) + 5000,
            followingCount: Math.floor(Math.random() * 1000) + 500,
            postsCount: Math.floor(Math.random() * 30) + 10,
            engagementRate: Math.random() * 10 + 2,
            metrics: {
              impressions: Math.floor(Math.random() * 100000) + 10000,
              reach: Math.floor(Math.random() * 50000) + 5000,
              clicks: Math.floor(Math.random() * 5000) + 100,
            },
          },
        });
      }
    }
    console.log(`✅ Analytics de 30 días creados para ${socialAccounts.length} cuentas`);

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📌 Credenciales de prueba:');
    console.log('   Email: demo@socialflow.app');
    console.log('   Contraseña: Demo123!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();

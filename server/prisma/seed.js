import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NexGen Solutions database seeding...');

  // 1. Seed Admin User
  const adminName = process.env.SEED_ADMIN_NAME || 'NexGen Admin';
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@nexgen.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash: passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash: passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (Role: ${admin.role})`);

  // 2. Seed Official Services
  const servicesData = [
    {
      title: 'Web Development',
      slug: 'web-development',
      shortDescription: 'Custom, high-performance web applications built with modern frameworks and responsive design.',
      description: 'NexGen Solutions delivers scalable, secure, and SEO-optimized web applications tailored to business needs. Our web development stack includes React, Next.js, Express, Node.js, and modern databases.',
      icon: 'Globe',
      displayOrder: 1,
    },
    {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      shortDescription: 'Native and cross-platform mobile applications for iOS and Android devices.',
      description: 'We craft intuitive mobile experiences using React Native, Flutter, and native APIs. From concept to App Store deployment, we focus on smooth animations, offline resilience, and robust security.',
      icon: 'Smartphone',
      displayOrder: 2,
    },
    {
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      shortDescription: 'Tailored software systems built to solve specialized business challenges.',
      description: 'End-to-end custom software solutions designed around your unique workflow, automating complex business processes with modern system architecture.',
      icon: 'Code',
      displayOrder: 3,
    },
    {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      shortDescription: 'User-centered interface design, wireframing, interactive prototyping, and design systems.',
      description: 'Creating visually stunning, user-friendly digital products. Our design process includes user research, wireframing, UI kits, design systems, and responsive layout optimization.',
      icon: 'Layout',
      displayOrder: 4,
    },
    {
      title: 'E-Commerce Solutions',
      slug: 'e-commerce-solutions',
      shortDescription: 'Scalable e-commerce platforms with secure payment gateways and inventory management.',
      description: 'Full-featured online storefronts designed for high conversion, multi-currency support, order management, payment integration, and inventory synchronization.',
      icon: 'ShoppingCart',
      displayOrder: 5,
    },
    {
      title: 'Business Management Systems',
      slug: 'business-management-systems',
      shortDescription: 'Integrated ERP, CRM, and portal solutions for operational efficiency.',
      description: 'Custom internal portals, CRM modules, inventory tracking, and employee management systems designed to streamline daily enterprise operations.',
      icon: 'Briefcase',
      displayOrder: 6,
    },
    {
      title: 'API Integration',
      slug: 'api-integration',
      shortDescription: 'Secure RESTful and GraphQL API development and third-party service integrations.',
      description: 'Connecting external systems, payment gateways, messaging services, and legacy platforms through clean, well-documented, high-throughput APIs.',
      icon: 'Cpu',
      displayOrder: 7,
    },
    {
      title: 'Database Solutions',
      slug: 'database-solutions',
      shortDescription: 'Relational and NoSQL database architecture, optimization, and migration.',
      description: 'Expert database schema design, query optimization, indexing, backup management, and data migration across MySQL, PostgreSQL, MongoDB, and Redis.',
      icon: 'Database',
      displayOrder: 8,
    },
    {
      title: 'Cloud Solutions',
      slug: 'cloud-solutions',
      shortDescription: 'Cloud infrastructure setup, containerization, deployment, and server management.',
      description: 'Deploying and managing web applications on AWS, Google Cloud, Docker environments, and modern CI/CD pipelines for optimal uptime and elasticity.',
      icon: 'Cloud',
      displayOrder: 9,
    },
    {
      title: 'Maintenance & Technical Support',
      slug: 'maintenance-technical-support',
      shortDescription: 'Ongoing maintenance, security updates, performance audits, and SLA support.',
      description: 'Proactive application monitoring, bug fixes, dependency updates, database backups, and dedicated technical assistance for business continuity.',
      icon: 'ShieldCheck',
      displayOrder: 10,
    },
  ];

  for (const s of servicesData) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  console.log(`✅ ${servicesData.length} official services seeded.`);

  // 3. Seed Generic Informational FAQs
  const faqsData = [
    {
      question: 'What services does NexGen Solutions offer?',
      answer: 'NexGen Solutions provides web development, mobile app development, custom software engineering, UI/UX design, e-commerce platforms, API integration, and cloud management.',
      displayOrder: 1,
    },
    {
      question: 'How do I request a quote for my project?',
      answer: 'You can submit a project quote request through our online contact form or dedicated quote request form specifying your timeline, requirements, and budget.',
      displayOrder: 2,
    },
    {
      question: 'What technologies does NexGen Solutions specialize in?',
      answer: 'Our core stack includes React, Next.js, Node.js, Express, Python, React Native, MySQL, PostgreSQL, Prisma, Docker, and modern cloud platforms.',
      displayOrder: 3,
    },
    {
      question: 'Do you offer ongoing technical maintenance after project delivery?',
      answer: 'Yes, we provide flexible ongoing maintenance, security updates, server monitoring, and technical support plans tailored to your operational needs.',
      displayOrder: 4,
    },
  ];

  // Clear & reseed base informational FAQs cleanly using question matching
  for (const f of faqsData) {
    const existingFaq = await prisma.fAQ.findFirst({
      where: { question: f.question },
    });
    if (existingFaq) {
      await prisma.fAQ.update({
        where: { id: existingFaq.id },
        data: f,
      });
    } else {
      await prisma.fAQ.create({
        data: f,
      });
    }
  }

  console.log(`✅ ${faqsData.length} baseline informational FAQs seeded.`);

  // 4. Seed Baseline Website Settings
  const defaultSetting = {
    companyName: 'NexGen Solutions',
    tagline: 'Software & Web Development',
    companyDescription: 'NexGen Solutions is a modern technology company crafting high-performance web applications, custom software systems, and mobile solutions.',
    email: 'info@nexgen.local',
    phone: null,
    whatsapp: null,
    address: null,
    heroEyebrow: 'Innovate • Scale • Succeed',
    heroHeading: 'Next-Generation Enterprise Software & Digital Solutions',
    heroDescription: 'We design and build bespoke software applications, web platforms, and mobile apps that empower businesses to scale effectively.',
    primaryCtaText: 'Get a Quote',
    secondaryCtaText: 'Explore Services',
    projectsCompleted: null,
    technologiesCount: null,
    clientSatisfactionText: null,
    supportAvailabilityText: null,
  };

  const existingSetting = await prisma.websiteSetting.findFirst();
  if (existingSetting) {
    await prisma.websiteSetting.update({
      where: { id: existingSetting.id },
      data: defaultSetting,
    });
  } else {
    await prisma.websiteSetting.create({
      data: defaultSetting,
    });
  }

  console.log('✅ Base website settings record seeded.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

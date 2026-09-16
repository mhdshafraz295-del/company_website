import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting Collaborator & Partner Feature Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test Collaborator Creation
    console.log('1. Testing Collaborator Model & Creation...');
    const testCollab = await prisma.collaborator.create({
      data: {
        name: 'Apex Innovation Lab',
        partnerType: 'Strategic Alliance',
        shortDescription: 'Collaborating on enterprise cloud applications and scalable APIs.',
        phone: '+94 77 123 4567',
        whatsapp: '94771234567',
        email: 'partnerships@apexinnovation.com',
        website: 'https://apexinnovation.com',
        displayOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    });

    assert(testCollab.id > 0, 'Collaborator created with valid auto-increment ID');
    assert(testCollab.name === 'Apex Innovation Lab', 'Collaborator name persisted correctly');
    assert(testCollab.isFeatured === true, 'Collaborator isFeatured flag set to true');
    assert(testCollab.isActive === true, 'Collaborator isActive flag set to true');

    // 2. Test Project ↔ Collaborator Association
    console.log('\n2. Testing Project ↔ Collaborator Relation...');
    const testProject = await prisma.project.create({
      data: {
        title: 'Cloud Analytics Platform',
        slug: 'cloud-analytics-platform-test',
        shortDescription: 'Real-time financial analytics dashboard built jointly with Apex.',
        fullDescription: 'Comprehensive financial analytics and reporting architecture with automated pipelines.',
        category: 'BUSINESS_SYSTEM',
        completionYear: 2026,
        collaboratorId: testCollab.id,
        published: true,
        featured: true,
      },
      include: {
        collaborator: true,
      },
    });

    assert(testProject.collaboratorId === testCollab.id, 'Project correctly references collaboratorId');
    assert(testProject.collaborator?.name === 'Apex Innovation Lab', 'Project relation resolves collaborator details');

    // 3. Test Testimonial ↔ Collaborator & Project Association
    console.log('\n3. Testing Testimonial ↔ Collaborator & Project Relation...');
    const testReview = await prisma.testimonial.create({
      data: {
        clientName: 'Sarah Jenkins',
        company: 'Apex Innovation Lab',
        position: 'Head of Engineering',
        rating: 5,
        review: 'The collaboration with Nexgen was flawless from inception to enterprise rollout.',
        approved: true,
        isVisible: true,
        collaboratorId: testCollab.id,
        projectId: testProject.id,
      },
      include: {
        collaborator: true,
        project: true,
      },
    });

    assert(testReview.collaboratorId === testCollab.id, 'Testimonial correctly linked to collaborator');
    assert(testReview.projectId === testProject.id, 'Testimonial correctly linked to project');
    assert(testReview.collaborator?.name === 'Apex Innovation Lab', 'Testimonial relation resolves collaborator');
    assert(testReview.project?.title === 'Cloud Analytics Platform', 'Testimonial relation resolves project');

    // 4. Test Collaborator Query with Nested Relations
    console.log('\n4. Testing Collaborator Query with Projects & Reviews...');
    const fetchedCollab = await prisma.collaborator.findUnique({
      where: { id: testCollab.id },
      include: {
        projects: true,
        testimonials: true,
        _count: {
          select: { projects: true, testimonials: true },
        },
      },
    });

    assert(fetchedCollab.projects.length === 1, 'Collaborator query retrieves linked project');
    assert(fetchedCollab.testimonials.length === 1, 'Collaborator query retrieves linked review');
    assert(fetchedCollab._count.projects === 1, 'Collaborator projects count aggregate is 1');
    assert(fetchedCollab._count.testimonials === 1, 'Collaborator testimonials count aggregate is 1');

    // 5. Test Backward Compatibility: Unassigned Project & Testimonial
    console.log('\n5. Testing Backward Compatibility (Unassigned records)...');
    const independentProject = await prisma.project.create({
      data: {
        title: 'Independent Mobile App',
        slug: 'independent-mobile-app-test',
        shortDescription: 'Stand-alone mobile app with no partner relation.',
        fullDescription: 'Native mobile app engineered independently.',
        category: 'MOBILE_APP',
        published: true,
      },
    });
    assert(independentProject.collaboratorId === null, 'Independent project has collaboratorId as null');

    const independentReview = await prisma.testimonial.create({
      data: {
        clientName: 'Direct Client',
        rating: 5,
        review: 'Direct client review with no partner.',
        approved: true,
        isVisible: true,
      },
    });
    assert(independentReview.collaboratorId === null, 'Independent review has collaboratorId as null');
    assert(independentReview.projectId === null, 'Independent review has projectId as null');

    // 6. Test Deletion Safety (onDelete: SetNull Guarantee)
    console.log('\n6. Testing Deletion Safety (Collaborator deletion must NOT delete project)...');
    const tempCollab = await prisma.collaborator.create({
      data: {
        name: 'Temporary Partner for Deletion Test',
        isActive: true,
      },
    });

    const tempProject = await prisma.project.create({
      data: {
        title: 'Preserved Project Under Deletion Test',
        slug: 'preserved-project-deletion-test',
        shortDescription: 'This project must remain intact when partner is deleted.',
        fullDescription: 'Verification of non-destructive foreign key constraint behavior.',
        category: 'WEBSITE',
        collaboratorId: tempCollab.id,
        published: true,
      },
    });

    const tempReview = await prisma.testimonial.create({
      data: {
        clientName: 'Preserved Reviewer',
        rating: 5,
        review: 'This review must remain intact when partner is deleted.',
        collaboratorId: tempCollab.id,
        projectId: tempProject.id,
        approved: true,
        isVisible: true,
      },
    });

    // Delete the collaborator
    await prisma.collaborator.delete({
      where: { id: tempCollab.id },
    });

    // Check project and review still exist!
    const verifiedProject = await prisma.project.findUnique({
      where: { id: tempProject.id },
    });
    assert(verifiedProject !== null, 'CRITICAL SAFETY: Project was NOT deleted when collaborator was deleted');
    assert(verifiedProject.collaboratorId === null, 'Project collaboratorId was safely detached to null');

    const verifiedReview = await prisma.testimonial.findUnique({
      where: { id: tempReview.id },
    });
    assert(verifiedReview !== null, 'CRITICAL SAFETY: Testimonial was NOT deleted when collaborator was deleted');
    assert(verifiedReview.collaboratorId === null, 'Testimonial collaboratorId was safely detached to null');
    assert(verifiedReview.projectId === tempProject.id, 'Testimonial project relation remains intact');

    // Clean up temporary records created during test
    await prisma.testimonial.deleteMany({
      where: { id: { in: [testReview.id, independentReview.id, tempReview.id] } },
    });
    await prisma.project.deleteMany({
      where: { id: { in: [testProject.id, independentProject.id, tempProject.id] } },
    });
    await prisma.collaborator.delete({
      where: { id: testCollab.id },
    });

    console.log('\n========================================');
    console.log(`SUMMARY: ${passed} passed, ${failed} failed.`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Test suite encountered an error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();


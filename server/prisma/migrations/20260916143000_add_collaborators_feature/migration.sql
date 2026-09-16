-- CreateTable
CREATE TABLE `collaborators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `partner_type` VARCHAR(191) NULL,
    `short_description` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `display_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_featured` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `collaborators_is_active_display_order_idx`(`is_active`, `display_order`),
    INDEX `collaborators_is_featured_idx`(`is_featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `collaborator_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `testimonials` ADD COLUMN `collaborator_id` INTEGER NULL,
    ADD COLUMN `project_id` INTEGER NULL;

-- CreateIndex
CREATE INDEX `projects_collaborator_id_idx` ON `projects`(`collaborator_id`);

-- CreateIndex
CREATE INDEX `testimonials_collaborator_id_idx` ON `testimonials`(`collaborator_id`);

-- CreateIndex
CREATE INDEX `testimonials_project_id_idx` ON `testimonials`(`project_id`);

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_collaborator_id_fkey` FOREIGN KEY (`collaborator_id`) REFERENCES `collaborators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_collaborator_id_fkey` FOREIGN KEY (`collaborator_id`) REFERENCES `collaborators`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `testimonials` ADD CONSTRAINT `testimonials_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


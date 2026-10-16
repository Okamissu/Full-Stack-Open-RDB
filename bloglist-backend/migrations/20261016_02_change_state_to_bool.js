module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" DROP DEFAULT`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" TYPE BOOLEAN
         USING ("state" = 'read')`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" SET DEFAULT false`,
        { transaction },
      );
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" DROP DEFAULT`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" TYPE VARCHAR(6)
         USING (CASE WHEN "state" THEN 'read' ELSE 'unread' END)`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state"
         TYPE "enum_user_blogs_state"
         USING ("state"::"enum_user_blogs_state")`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE "user_blogs"
         ALTER COLUMN "state" SET DEFAULT 'unread'`,
        { transaction },
      );
    });
  },
};

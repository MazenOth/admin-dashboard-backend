import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

describe('Database Connection Integration Tests', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize(
      process.env.DB_NAME!,
      process.env.DB_USER!,
      process.env.DB_PASSWORD!,
      {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT!),
        dialect: 'postgres',
        logging: false,
      }
    );

    try {
      await sequelize.authenticate();
      console.log(
        'Connection to the database has been established successfully.'
      );
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error;
    }
  });

  it('should connect to the database successfully', async () => {
    expect(sequelize).toBeDefined();
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should close the database connection gracefully', async () => {
    await expect(sequelize.close()).resolves.not.toThrow();
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });
});

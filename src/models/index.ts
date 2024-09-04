import sequelize from '../config/database';
import User from './User';
import Role from './Role';
import Client from './Client';
import Helper from './Helper';
import City from './City';
import Matching from './Matching';

const initializeModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    await sequelize.sync();
    console.log('All models synchronized successfully...');
  } catch (error) {
    console.error('Error during model synchronization: ', error);
  }
};

export {
  sequelize,
  User,
  Role,
  Client,
  Helper,
  City,
  Matching,
  initializeModels,
};

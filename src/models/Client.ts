import { Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Country from './City';
import { IClient } from '../interfaces';

class Client extends Model<IClient> implements IClient {
  UserId!: number;
  CityId!: number;
}

Client.init(
  {},
  {
    sequelize,
    modelName: 'Client',
  }
);

// User association 1:1
User.hasOne(Client, { onDelete: 'CASCADE' });
Client.belongsTo(User);

export default Client;

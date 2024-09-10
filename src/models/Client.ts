import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IClient } from '../interfaces';
import User from '../models/User';

class Client extends Model<IClient> implements IClient {
  id!: number;
  UserId!: number;
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

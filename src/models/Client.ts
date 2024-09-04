import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IClient } from '../interfaces';
import { Matching, User } from '../models';

class Client extends Model<IClient> implements IClient {
  UserId!: number;
  CityId!: number;
  matching_id!: number | null;
}

Client.init(
  {
    matching_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: Matching,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Client',
  }
);

// User association 1:1
User.hasOne(Client, { onDelete: 'CASCADE' });
Client.belongsTo(User);

export default Client;

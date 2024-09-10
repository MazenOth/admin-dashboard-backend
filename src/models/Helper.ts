import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IHelper } from '../interfaces';
import User from '../models/User';

class Helper extends Model<IHelper> implements IHelper {
  id!: number;
  UserId!: number;
}

Helper.init(
  {},
  {
    sequelize,
    modelName: 'Helper',
  }
);

// User association 1:1
User.hasOne(Helper, { onDelete: 'CASCADE' });
Helper.belongsTo(User);

export default Helper;

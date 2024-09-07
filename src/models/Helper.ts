import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IHelper } from '../interfaces';
import { Matching, User } from '../models';

class Helper extends Model<IHelper> implements IHelper {
  UserId!: number;
  CityId!: number;
  matching_id!: number | null;
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

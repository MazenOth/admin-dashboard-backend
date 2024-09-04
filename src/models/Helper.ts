import { Model } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Country from './City';
import { IHelper } from '../interfaces';

class Helper extends Model<IHelper> implements IHelper {
  UserId!: number;
  CityId!: number;
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

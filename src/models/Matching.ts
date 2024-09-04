import { Model } from 'sequelize';
import sequelize from '../config/database';
import Client from './Client';
import Helper from './Helper';
import { IMatching } from '../interfaces';

class Matching extends Model<IMatching> implements IMatching {
  ClientId!: number;
  HelperId!: number;
}

Matching.init(
  {},
  {
    sequelize,
    modelName: 'Matching',
  }
);

// Helper association 1:1
Helper.hasOne(Matching, { onDelete: 'CASCADE' });
Matching.belongsTo(Helper);

// Client association 1:1
Client.hasOne(Matching, { onDelete: 'CASCADE' });
Matching.belongsTo(Helper);

export default Matching;

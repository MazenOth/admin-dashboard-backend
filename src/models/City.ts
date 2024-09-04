import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { ICity } from '../interfaces';

class City extends Model<ICity> implements ICity {
  id!: number;
  name!: string;
}

City.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'City',
  }
);

export default City;

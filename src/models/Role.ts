import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IRole } from '../interfaces';

class Role extends Model<IRole> implements IRole {
  id!: number;
  name!: string;
}

Role.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Role',
  }
);

export default Role;

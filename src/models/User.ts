import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { IUser } from '../interfaces';
import Role from './Role';
import City from './City';

class User extends Model<IUser> implements IUser {
  id!: number;
  first_name!: string;
  last_name!: string;
  email!: string;
  phone_number!: string;
  CityId!: number;
  RoleId!: number;
}

User.init(
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// Role association 1:1
Role.hasOne(User, { onDelete: 'CASCADE' });
User.belongsTo(Role);

// City association 1:m
City.hasMany(User, { onDelete: 'CASCADE' });
User.belongsTo(City);

export default User;

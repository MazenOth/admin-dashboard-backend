import { Role } from '../models';

export class RoleService {
  static async getRoleId(role_name: string): Promise<number> {
    try {
      const role = await Role.findOne({
        where: { name: role_name },
      });
      if (!role) {
        console.log('Role not found');
        throw new Error('Role not found');
      } else {
        console.log('Role found');
        return role.id;
      }
    } catch (err) {
      throw err;
    }
  }
}

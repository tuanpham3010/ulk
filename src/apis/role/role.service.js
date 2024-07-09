const Role = require('./role.model');
// const { BadRequest, NotFoundException, ServerError } = require('@/libs/errors');

class RoleService {
    // constructor() {

    // }
    async getRoleNameById(roleId) {
        if (roleId) {
            let role = await Role.findById(roleId);
            if (role) {
                return role;
            }
        }
        return {
            success: false,
            message: 'Cannot find role by id'
        };

    }
    async getRoleIdByName(roleName) {
        if (roleName) {
            let role = await Role.findOne({ name: roleName });
            if (role) {
                return role;
            }
        }
        return {
            success: false,
            message: 'Cannot find role by name'
        };
    }
}

module.exports = RoleService;
const RoleService = require('./role.service');

class RoleController {
    constructor() {
        this.RoleService = new RoleService();
        this.getRoleId = this.getRoleId.bind(this);
        this.getRoleName = this.getRoleName.bind(this);
    }

    /**
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
    async getRoleId(req, res) {
        try {
            const { roleName } = req.query;
            const role = await this.RoleService.getRoleIdByName(roleName);
            res.json(role);
        } catch (error) {
            res.json(error);
        }
    }

    /**
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
    async getRoleName(req, res) {
        try {
            const { roleId } = req.query;
            const role = await this.RoleService.getRoleNameById(roleId);
            res.json(role);
        } catch (error) {
            res.json(error);
        }
    }
}

module.exports = new RoleController();
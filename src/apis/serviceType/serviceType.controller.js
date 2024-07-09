const ServiceTypeService = require('./serviceType.service');

class ServiceTypeController {
    constructor() {
        this.ServiceTypeService = new ServiceTypeService();
        this.getAllServiceType = this.getAllServiceType.bind(this);
        this.getServiceTypeId = this.getServiceTypeId.bind(this);
        this.getServiceTypeName = this.getServiceTypeName.bind(this);
        this.createServiceType = this.createServiceType.bind(this);
        this.deleteServiceType = this.deleteServiceType.bind(this);
        this.updateServiceType = this.updateServiceType.bind(this);
    }

    /**
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
    async getAllServiceType(req, res) {
        try {
            const response = await this.ServiceTypeService.getAllServiceType();
            res.json({
                success: true,
                data: response
            });
        } catch (error) {
            res.json(error);
        }
    }
    /**
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
    async getServiceTypeId(req, res) {
        try {
            const { roleName } = req.query;
            const role = await this.ServiceTypeService.getServiceTypeIdByName(roleName);
            res.json(role);
        } catch (error) {
            res.json(error);
        }
    }

    /**
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */
    async getServiceTypeName(req, res) {
        try {
            const { roleId } = req.query;
            const role = await this.ServiceTypeService.getServiceTypeNameById(roleId);
            res.json(role);
        } catch (error) {
            res.json(error);
        }
    }

    async createServiceType(req, res) {
        try {
            const { name } = req.body;
            const newServicetype = await this.ServiceTypeService.createServiceType(name);
            const result = {
                success: true,
                newServicetype
            };
            res.json(result);
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({
                status: status,
                message: error.message,
            });
        }
    }

    async deleteServiceType(req, res) {
        try {
            const serviceTypeId = req.params.id;
            const deleteServiceType = await this.ServiceTypeService.deleteServiceType(serviceTypeId);
            const result = {
                success: true,
                deleteServiceType
            };
            res.json(result);
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({
                status: status,
                message: error.message,
            });
        }
    }

    async updateServiceType(req, res) {
        try {
            const serviceTypeId = req.params.id;
            const { newName } = req.body;
            const newServiceType = await this.ServiceTypeService.updateServiceType(serviceTypeId, newName);
            const result = {
                success: true,
                newServiceType
            };
            res.json(result);
        } catch (error) {
            const status = error.status || 500;
            res.status(status).json({
                status: status,
                message: error.message,
            });
        }
    }
}

module.exports = new ServiceTypeController();
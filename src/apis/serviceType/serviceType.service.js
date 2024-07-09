const ServiceType = require('./serviceType.model');
const { BadRequest } = require('@/libs/errors');

class ServiceTypeService {
    // constructor() {

    // }
    async getAllServiceType() {
        try {
            const serviceTypes = await ServiceType.find({});
            if (serviceTypes) {
                return serviceTypes;
            }
            return { serviceTypes: [] };
        } catch (error) {
            throw new BadRequest(error);
        }

    }
    async getServiceTypeNameById(serviceTypeId) {
        try {
            if (serviceTypeId) {
                let serviceType = await ServiceType.findById(serviceTypeId);
                if (serviceType) {
                    return serviceType;
                }
            }
            return {
                success: false,
                message: 'Cannot find serviceType by id'
            };

        } catch (error) {
            throw new BadRequest(error);
        }

    }
    async getServiceTypeIdByName(serviceTypeName) {
        try {
            if (serviceTypeName) {
                let serviceType = await ServiceType.findOne({ name: serviceTypeName });
                if (serviceType) {
                    return serviceType;
                }
            }
            return {
                success: false,
                message: 'Cannot find serviceType by name'
            };
        } catch (error) {
            throw new BadRequest(error);
        }
    }

    async createServiceType(name) {
        const checkExist = await ServiceType.findOne({
            name: name
        });
        if (checkExist) {
            throw new BadRequest('loại service đã tồn tại, vui lòng kiểm tra lại');
        } else {
            const newServiceType = new ServiceType({
                name: name
            });
            const createNewServiceType = await newServiceType.save();
            if (!createNewServiceType) throw new BadRequest('Tạo loại service mới gặp lỗi, vui lòng thử lại');
            return createNewServiceType;
        }
    }

    async deleteServiceType(serviceTypeId) {
        try {
            await ServiceType.findByIdAndDelete(serviceTypeId);
        } catch (error) {
            throw new Error('Lỗi khi xóa sản phẩm');
        }
    }

    async updateServiceType(serviceTypeId, newName) {
        try {
            const updateServiceType = await ServiceType.findByIdAndUpdate(serviceTypeId, { name: newName }, { new: true });
            if (!updateServiceType) {
                throw new Error('loại service không tồn tại');
            }
            return updateServiceType;
        } catch (error) {
            throw new Error('Lỗi khi cập nhật loại service');
        }
    }
}

module.exports = ServiceTypeService;
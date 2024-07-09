const { BadRequest } = require('@/libs/errors');
const Network = require('./network.model');
const NetworkRepository = require('./network.respository');

class ServiceTypeService {
	constructor() {
		this.networkRepository = new NetworkRepository();
	}
	async getAllNetwork({ pageSize, currentPage }) {
		let query = {};
		let limit = pageSize || 20;
		let page = currentPage || 1;
		const { data, pageInfo } = await this.networkRepository.findNetworks({
			query,
			page,
			limit,
		});
		return {
			success: true,
			data,
			pageInfo,
		};
	}

	async createNetwork(network) {
		const checkExist = await Network.findOne({
			title: network,
		});
		if (checkExist) {
			throw new BadRequest('Nhà mạng đã tồn tại, vui lòng kiểm tra lại');
		} else {
			const newNetwork = new Network({
				title: network,
			});
			const createNetwork = await newNetwork.save();
			if (!createNetwork)
				throw new BadRequest(
					'Tạo nhà mạng mới gặp lỗi, vui lòng thử lại'
				);
			return {
				success: true,
				data: createNetwork,
			};
		}
	}

	async deleteNetwork(netWorkId) {
		const network = await Network.findByIdAndDelete(netWorkId);
		if (!network) throw new BadRequest('Lỗi khi xóa sản phẩm');
		return { success: true };
	}

	async updateNetwork(netWorkId, newName) {
		const updatedNetwork = await Network.findByIdAndUpdate(
			netWorkId,
			{ title: newName },
			{ new: true }
		);
		if (!updatedNetwork) {
			throw new Error('Nhà mạng không tồn tại');
		}
		return { success: true, data: updatedNetwork };
	}
}

module.exports = ServiceTypeService;

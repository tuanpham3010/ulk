const NetWorkService = require('./network.service');

class NetworkController {
	constructor() {
		this.NetWorkService = new NetWorkService();
		this.getAllNetwork = this.getAllNetwork.bind(this);
		this.createNetwork = this.createNetwork.bind(this);
		this.deleteNetwork = this.deleteNetwork.bind(this);
		this.updateNetwork = this.updateNetwork.bind(this);
	}

	/**
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	async getAllNetwork(req, res) {
		const response = await this.NetWorkService.getAllNetwork(req.query);

		res.json(response);
	}
	async createNetwork(req, res) {
		const { network } = req.body;
		const newNetwork = await this.NetWorkService.createNetwork(network);

		res.json(newNetwork);
	}

	async deleteNetwork(req, res) {
		const networkId = req.params.id;
		const deleteNetwork = await this.NetWorkService.deleteNetwork(
			networkId
		);

		res.json(deleteNetwork);
	}

	async updateNetwork(req, res) {
		const networkId = req.params.id;
		const { newName } = req.body;
		const newNetwork = await this.NetWorkService.updateNetwork(
			networkId,
			newName
		);
		res.json(newNetwork);
	}
}

module.exports = new NetworkController();

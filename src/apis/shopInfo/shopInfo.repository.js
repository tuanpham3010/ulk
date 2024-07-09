const ShopInfo = require('./shopInfo.model');
class ShopInfoRepository {
    static async getShopInfo(select = '') {
        return await ShopInfo.findOne({}).select(select);
    }
}
module.exports = ShopInfoRepository;
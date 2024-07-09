const { ROLE_ENUM } = require('@/common/const/app.key');
const roleList = [ROLE_ENUM.user, ROLE_ENUM.admin];
class MiddlewareUtil {
	static checkRequestInList(path = '', method = '', list = []) {
		const isInList = list.some((item) => {
			if (method != item.method) return false;
			if (item.exact) {
				return path === item.path;
			}
			return path.startsWith(item.path);
		});
		return isInList;
	}
	static getTypeRequest({
		path = '',
		method = '',
		whitelist = [],
		adminList = [],
		refreshList = [],
	}) {
		const isInAdminList = MiddlewareUtil.checkRequestInList(
			path,
			method,
			adminList
		);
		if (isInAdminList) {
			return {
				requestType: 'access',
				roleNeeded: [ROLE_ENUM.admin, ROLE_ENUM.moderator],
			};
		}
		const isInWhiteList = MiddlewareUtil.checkRequestInList(
			path,
			method,
			whitelist
		);
		if (isInWhiteList) {
			return {
				requestType: 'white',
				roleNeeded: roleList,
			};
		}
		const isInRefreshList = MiddlewareUtil.checkRequestInList(
			path,
			method,
			refreshList
		);
		if (isInRefreshList) {
			return {
				requestType: 'refresh',
				roleNeeded: roleList,
			};
		}
		return {
			requestType: 'access',
			roleNeeded: roleList,
		};
	}
}

module.exports = MiddlewareUtil;

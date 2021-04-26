import BaseComponent from '../BaseComponent';
import Transaction from '../../Core/Transaction';
import GetAppsByFolderId from '../../Service/GetAppsByFolderId';

const method = 'GET';
const action = 'militarized-zone/apps-management/apps/:folderId';
export class AppsGetByFolderId extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request.user;
    const { folderId } = request.params;
    
    
    const getAppsByFolderId = new GetAppsByFolderId(Transaction.strToId(user), Transaction.strToId(folderId));
    const result = await getAppsByFolderId.getApps();

    super.res(response, result.code, result.status, {
      message: result.message,
      data: result.data,
    });
  }
}

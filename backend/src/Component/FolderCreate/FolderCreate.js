import BaseComponent from '../BaseComponent';
import CreateFolder from '../../Service/CreateFolder';

const method = 'POST';
const action = 'militarized-zone/folder-management/folder';
export class FolderCreate extends BaseComponent {
  constructor(router) {
    super(router, method, action);
    super.initialization(this.handler);
  }

  async handler(request, response, next) {
    const { user } = request;
    const { path } = request.body;

    const createFolder = new CreateFolder(user, path);
    const result = await createFolder.create();

    super.res(response, result.error, result.success, result.message);
  }
}

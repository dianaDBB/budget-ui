import { FileConfig, FileConfigData } from '@data-models/file-config.data';

export function getAllFileConfigsResponse(
  params: { fileConfigList: FileConfig[] } = { fileConfigList: FileConfigData.all() },
) {
  const response = params.fileConfigList;

  return response;
}

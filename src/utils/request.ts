import { RuntimeOptionsConfig } from '@alilc/lowcode-datasource-types';
export function createAxiosFetchHandler(axios: any, config?: Record<string, unknown>) {
  return async function (options: RuntimeOptionsConfig) {
    const requestConfig = {
      ...options,
      url: options.uri,
      method: options.method,
      data: options.params,
      headers: options.headers,
      ...config,
    };
    const response = await axios(requestConfig);
    return response;
  };
}

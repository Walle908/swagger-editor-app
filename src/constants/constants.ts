export const enum ErrorMessage {
  BOUNDARY_ERROR = 'Something went wrong...',
  NETWORK_ERROR = 'Network error. Please check your internet connection.',
  NO_ERROR = '',
  NOT_FOUND = 'No characters found',
  SERVER_ERROR = 'Server error',
}

export const TEXT = {
  toolbar: {
    title: 'Swagger OpenAPI Editor & Viewer',
    validStatus: 'Valid · openapi 3.0.3',
    invalidStatus: 'Invalid',
    btnImport: 'Import URL',
    btnSave: 'Save Spec',
  },
  editor: {
    title: 'OpenAPI Specification Editor',
    lines: 'lines',
  },
  viewer: {
    title: 'Swagger Endpoints Viewer',
    placeholder: 'Endpoints will automatically populate here once a valid schema is provided.',
    filterPlaceholder: 'Filter endpoints (e.g., /pet)...',
  },
};

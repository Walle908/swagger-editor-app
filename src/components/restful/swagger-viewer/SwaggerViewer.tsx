'use client';

import styles from './SwaggerViewer.module.scss';

interface SwaggerViewerProps {
  title?: string;
  version?: string;
  oasVersion?: string;
  baseUrl?: string;
}

const mockCategories = [
  {
    id: 'pet-group',
    name: 'pet',
    description: 'Everything about your Pets',
    endpoints: [
      {
        id: 'p1',
        method: 'POST',
        path: '/pet',
        description: 'Add a new pet to the store',
        type: 'post',
      },
      {
        id: 'p2',
        method: 'PUT',
        path: '/pet',
        description: 'Update an existing pet in the store',
        type: 'put',
      },
      {
        id: 'p3',
        method: 'GET',
        path: '/pet/findByStatus',
        description: 'Finds Pets by status',
        type: 'get',
      },
      { id: 'p4', method: 'GET', path: '/pet/{petId}', description: 'Find pet by ID', type: 'get' },
      {
        id: 'p5',
        method: 'DELETE',
        path: '/pet/{petId}',
        description: 'Deletes a pet',
        type: 'delete',
      },
    ],
  },
  {
    id: 'store-group',
    name: 'store',
    description: 'Access to Petstore orders',
    endpoints: [
      {
        id: 's1',
        method: 'GET',
        path: '/store/inventory',
        description: 'Returns pet inventories by status',
        type: 'get',
      },
      {
        id: 's2',
        method: 'POST',
        path: '/store/order',
        description: 'Place an order for a pet',
        type: 'post',
      },
    ],
  },
  {
    id: 'user-group',
    name: 'user',
    description: 'Operations about user',
    endpoints: [
      { id: 'u1', method: 'POST', path: '/user', description: 'Create user', type: 'post' },
      {
        id: 'u2',
        method: 'GET',
        path: '/user/{username}',
        description: 'Get user by user name',
        type: 'get',
      },
    ],
  },
];

export function SwaggerViewer({
  title = 'Swagger Petstore',
  version = '1.0.27',
  oasVersion = '3.0.0',
  baseUrl = 'https://petstore3.swagger.io/api/v3',
}: SwaggerViewerProps) {
  return (
    <section className={styles.rightSide}>
      <div className={styles.viewerHeader}>
        <div className={styles.apiTitleRow}>
          <h2>{title}</h2>
          <p className={styles.badgeVersion}>{version}</p>
          <p className={styles.badgeOas}>OAS {oasVersion}</p>
        </div>
        <p className={styles.apiUrl}>{baseUrl}</p>
      </div>

      <div className={styles.viewerContent}>
        {mockCategories.map((category) => (
          <div key={category.id} className={styles.apiCategoryGroup}>
            <div className={styles.categoryHeader}>
              <h3>{category.name}</h3>
              <span
                className={category.name === 'user' ? styles.userDescCustom : styles.categoryDesc}>
                {category.description}
              </span>
            </div>

            <div className={styles.methodsList}>
              {category.endpoints.map((endpoint) => {
                let methodStyle = styles.methodGet;
                if (endpoint.type === 'post') methodStyle = styles.methodPost;
                if (endpoint.type === 'put') methodStyle = styles.methodPut;
                if (endpoint.type === 'delete') methodStyle = styles.methodDelete;

                return (
                  <div key={endpoint.id} className={`${styles.methodCard} ${methodStyle}`}>
                    <div className={styles.methodInfoLeft}>
                      <div className={styles.badgeMethod}>{endpoint.method}</div>
                      <span className={styles.pathText}>{endpoint.path}</span>
                      <span className={styles.descriptionText}>{endpoint.description}</span>
                    </div>
                    <div className={styles.arrowIcon}>⌄</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

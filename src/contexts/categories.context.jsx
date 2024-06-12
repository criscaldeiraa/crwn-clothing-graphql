import { createContext, useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';

export const CategoriesContext = createContext({
  categoriesMap: {},
});

const COLLECTIONS = gql`
  query {
    collections {
      title
      id
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`

export const CategoriesProvider = ({ children }) => {
  const { loading, error, data } = useQuery(COLLECTIONS);
  const [categoriesMap, setCategoriesMap] = useState({});

  useEffect(() => {
    if(data) {
      const { collections } = data;
      const collectionsMap = collections.reduce((acc, collection) => {
        const { title, items } = collection;
        acc[title.toLowerCase()] = items;
        return acc;
      }, {});

      setCategoriesMap(collectionsMap);
    }
  }, [data])

  //*First it will load the data, so loading: true - then data will be loaded and loading is false
  // console.log("loading", loading)
  // console.log("data", data);
  
  const value = { categoriesMap, loading };
  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

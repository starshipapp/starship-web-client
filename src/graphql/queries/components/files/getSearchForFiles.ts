import gql from "graphql-tag";
import IFileObject from "../../../../types/IFileObject";

export interface IGetSearchForFilesData {
  searchForFiles: IFileObject[]
}

const getSearchForFiles = gql`
  query GetSearchForFiles($componentId: ID!, $parent: String!, $searchText: String!) {
    searchForFiles(componentId: $componentId, parent: $parent, searchText: $searchText) {
      id,
      path,
      name,
      owner {
        id
      }
      createdAt
      type
      fileType
      size
      finishedUploading
    }
  }
`;

export default getSearchForFiles;
import { styled } from "styled-components";
import Chat from "./Chat";
import { UserType } from "../../../containers/HomeSidebarContainer";

const SearchContainer = styled.div`
  border-bottom: 1px solid gray;
`;

const SearchForm = styled.div`
  padding: 10px;
  input {
    background-color: transparent;
    border: none;
    color: white;
    outline: none;

    &::placeholder {
      color: lightgray;
    }
  }
`;

interface SearchProps{
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  searchResult: UserType | null;
  onClickSearchResult(): Promise<void>;
}

const Search = ({
  value,
  onChange,
  searchResult,
  onClickSearchResult,
}: SearchProps) => { 
  return (
    <SearchContainer>
      <SearchForm>
        <input
          type="text"
          placeholder="Find a user"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </SearchForm>
      {!searchResult && value && (
        <span style={{ padding: "10px", fontSize: "14px", fontWeight: 500 }}>
          User not found!
        </span>
      )}
      {Object.keys(searchResult || {}).length > 0 && (
        <Chat
          hasLastMessage={false}
          photoURL={searchResult?.photoURL || ""}
          displayName={searchResult?.displayName || ""}
          userChatId={searchResult?.uid || ""}
          onClick={onClickSearchResult}
        />
      )}
    </SearchContainer>
  );
};
export default Search;

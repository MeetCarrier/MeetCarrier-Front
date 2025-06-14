import search_icon from "../../../../../assets/img/icons/ChatIcon/search.svg";
import delete_icon from "../../../../../assets/img/icons/Chat/delete.svg";

interface ChatSearchProps {
  showSearchBar: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  onClose: () => void;
}

export const ChatSearch = ({
  showSearchBar,
  searchQuery,
  setSearchQuery,
  handleSearch,
  onClose,
}: ChatSearchProps) => {
  if (!showSearchBar) return null;

  return (
    <div className="flex items-center w-full h-[40px] bg-transparent">
      <div className="relative flex items-center flex-1 h-full bg-white rounded-lg shadow-md">
        <img
          src={search_icon}
          alt="search_icon"
          className="absolute left-3 w-[20px] h-[20px] opacity-60"
        />
        <input
          type="text"
          placeholder="대화 내용 검색"
          className="flex-grow py-2 pl-10 pr-10 text-base outline-none font-GanwonEduAll_Light"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        {searchQuery && (
          <img
            src={delete_icon}
            alt="clear search"
            className="absolute right-3 w-[20px] h-[20px] cursor-pointer opacity-60"
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>

      <button
        className="ml-2 text-[#333] font-GanwonEduAll_Light text-xl"
        onClick={onClose}
      >
        취소
      </button>
    </div>
  );
};

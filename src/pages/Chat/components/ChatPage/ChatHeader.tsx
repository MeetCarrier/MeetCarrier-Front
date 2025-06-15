import back_arrow from "../../../../assets/img/icons/HobbyIcon/back_arrow.svg";
import search_icon from "../../../../assets/img/icons/ChatIcon/search.svg";
import delete_icon from "../../../../assets/img/icons/Chat/delete.svg";

interface ChatHeaderProps {
  otherNickname: string;
  onBackClick: () => void;
  showSearchBar: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  onSearchClick: () => void;
  onSearchClose: () => void;
}

export const ChatHeader = ({
  otherNickname,
  onBackClick,
  showSearchBar,
  searchQuery,
  setSearchQuery,
  handleSearch,
  onSearchClick,
  onSearchClose,
}: ChatHeaderProps) => {
  return (
    <div className="absolute top-[50px] text-[#333333] left-0 right-0 px-6 text-center">
      <img
        src={back_arrow}
        alt="back_arrow"
        className="absolute top-1/2 -translate-y-1/2 left-6 w-[9px] h-[20px] cursor-pointer"
        onClick={onBackClick}
      />

      {showSearchBar ? (
        <div className="flex items-center w-full h-[40px]">
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
            onClick={onSearchClose}
          >
            취소
          </button>
        </div>
      ) : (
        <>
          <p className="text-[20px] font-MuseumClassic_L italic">
            {otherNickname}
          </p>
          <img
            src={search_icon}
            alt="search_icon"
            className="absolute top-1/2 -translate-y-1/2 right-6 w-[20px] h-[20px] cursor-pointer"
            onClick={onSearchClick}
          />
        </>
      )}
    </div>
  );
};

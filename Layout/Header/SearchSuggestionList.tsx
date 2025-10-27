import SVG from "@/CommonComponent/SVG";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setResponsiveSearch } from "@/Redux/Reducers/LayoutSlice";
import { MenuItem, SearchSuggestionListType } from "@/Types/LayoutTypes";
import Link from "next/link";

const SearchSuggestionList = ({ searchedArray, setSearchedWord }: SearchSuggestionListType) => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const dispatch = useAppDispatch();

  const handleLinkClick = () => {
    dispatch(setResponsiveSearch());
    setSearchedWord("");
  };

  return (
    <>
      {searchedArray?.map((item: MenuItem, index: number) => (
        <div className="ProfileCard u-cf" key={index}>
          <div className="ProfileCard-details">
            <div className="ProfileCard-realName">
              <Link className="realname  w-auto d-flex justify-content-start gap-2" href={`/${i18LangStatus}/${item.path}`} onClick={handleLinkClick}>
                <SVG iconId={`stroke-${item.icon}`} />
                {item.title}
              </Link>
            </div>
          </div>
        </div>
      ))}
      {!searchedArray.length && <p>Opps!! There are no result found.</p>}
    </>
  );
};

export default SearchSuggestionList;
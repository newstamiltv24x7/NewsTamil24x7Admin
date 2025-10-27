import { Form, Input, InputGroup } from "reactstrap";
import SVG from "@/CommonComponent/SVG";
import { ChangeEvent, useEffect, useState } from "react";
import { MenuItem, SearchSuggestionItem } from "@/Types/LayoutTypes";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setResponsiveSearch } from "@/Redux/Reducers/LayoutSlice";
import { MenuList } from "@/Data/Layout/Menu";
import ResponsiveSearchList from "./ResponsiveSearchList";

export const ResponsiveSearch = () => {
  const [arr, setArr] = useState<SearchSuggestionItem[]>([]);
  const [searchedWord, setSearchedWord] = useState<string>("");
  const [searchedArray, setSearchedArray] = useState<SearchSuggestionItem[]>([]);
  const { responsiveSearch } = useAppSelector((state) => state.layout);
  const dispatch = useAppDispatch();
  const toggleShow = () => dispatch(setResponsiveSearch());

  useEffect(() => {
    const suggestionArray: SearchSuggestionItem[] = [];
    const getAllLink = (item: MenuItem, icon: string | undefined) => {
      if (item.children) {
        item.children.forEach((ele) => {
          getAllLink(ele, icon);
        });
      } else {
        suggestionArray.push({ icon: icon, title: item.title, path: item.path || "" });
      }
    };
    MenuList?.forEach((item) => {
      item.Items?.forEach((child) => {
        getAllLink(child, child.icon);
      });
    });
    setArr(suggestionArray);
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (!searchedWord) setSearchedWord("");
    setSearchedWord(e.target.value);
    let data = [...arr];
    let result = data.filter((item) => item.title?.toLowerCase().includes(e.target.value.toLowerCase()));
    setSearchedArray(result);
  };

  return (
    <>
      <li className="d-md-none d-block">
        <Form className="search-form mb-0">
          <InputGroup>
            <span className="input-show">
              <div onClick={toggleShow}>
                <SVG iconId="search-header" />
              </div>
              <div id="searchInput" className={responsiveSearch ? "show" : ""}>
                <input type="search" placeholder="Search" value={searchedWord} onChange={(e) => handleSearch(e)} />
              </div>
            </span>
          </InputGroup>
          <div className={`Typeahead-menu header-menu custom-scrollbar ${searchedWord.length && responsiveSearch ? "is-open" : ""}`}>
            <ResponsiveSearchList searchedArray={searchedArray} setSearchedWord={setSearchedWord} />
          </div>
        </Form>
      </li>
    </>
  );
};

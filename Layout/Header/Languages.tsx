import { Href } from "@/Constant";
import { LanguagesData } from "@/Data/Layout";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { setLanguage } from "@/Redux/Reducers/LanguageSlice";
import { ChangeLngType, LanguageFlags } from "@/Types/LayoutTypes";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Languages = () => {
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);
  const { i18n } = useTranslation(i18LangStatus);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const languageFlags: LanguageFlags = { en: "us", es: "is", pt: "uy", fr: "nz", ae: "ae", du: "de", cn: "cn" };

  const changeLng = (item: ChangeLngType) => {
    i18n.changeLanguage(item.language);
    dispatch(setLanguage(item.data));
    const languageCodeRegex = /^\/[a-z]{2}(\/|$)/;
    const updatedPath = pathname.replace(languageCodeRegex, `/${item.data}$1`);
    router.push(updatedPath);
  };

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments.length > 0) {
      const language = pathSegments[0];
      if (language !== i18LangStatus) {
        dispatch(setLanguage(language));
      }
    }
  }, []);

  return (
    <li className="onhover-dropdown">
      <div className="cart-box text-uppercase f-w-700 d-flex align-items-center">
        <span>{i18LangStatus}</span>
      </div>
      <div className="language-dropdown onhover-show-div language-width">
        <ul className="language-list">
          {LanguagesData.map((item, i) => (
            <li className="p-0" key={i} onClick={() => {changeLng(item);}}>
              <Link className="text-decoration-none" data-lng={item.data} href={Href}>
                <i className={item.logo} /> {item.language}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default Languages;

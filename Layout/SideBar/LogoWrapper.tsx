import { ImagePath } from "@/Constant";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  handleResponsiveToggle,
  setToggleSidebar,
} from "@/Redux/Reducers/LayoutSlice";
import { Box } from "@mui/material";
import Link from "next/link";
import { Grid } from "react-feather";

export const LogoWrapper = () => {
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useAppSelector((state) => state.layout);
  const { i18LangStatus } = useAppSelector((state) => state.langSlice);

  return (
    <>
      <div className="logo-wrapper">
        <Link
          href={`/${i18LangStatus}/story`}
          style={{ display: "grid", placeItems: "center" }}
        >
          <Box width={"130px"}>
            <img
              className="img-fluid"
              src={`${ImagePath}/logo/logo.png`}
              alt=""
              width={"70%"}
              height={"100%"}
            />
          </Box>
        </Link>
        {/* <div
          className="back-btn"
          // onClick={() => dispatch(handleResponsiveToggle())}
        >
          <i className="fa fa-angle-left"> </i>
        </div>
        <div className="toggle-sidebar">
          <Grid
            className="status_toggle middle sidebar-toggle"
            // onClick={() => dispatch(setToggleSidebar(!toggleSidebar))}
          />
        </div> */}
      </div>
      <div className="logo-icon-wrapper">
        <Link href={`/${i18LangStatus}/story`}>
          <img
            className="img-fluid"
            src={`${ImagePath}/logo/logo-icon.png`}
            alt=""
          />
        </Link>
      </div>
    </>
  );
};

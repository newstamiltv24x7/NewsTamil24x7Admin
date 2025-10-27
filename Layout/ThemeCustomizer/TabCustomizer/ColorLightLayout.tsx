import { LightLayout } from "@/Constant";
import { LightColorData } from "@/Data/Layout";
import { useAppDispatch } from "@/Redux/Hooks";
import { setDarkMode } from "@/Redux/Reducers/LayoutSlice";
import { PropsLightColor } from "@/Types/LayoutTypes";

const ColorLightLayout = () => {
  const dispatch = useAppDispatch()
  const handleColor = (data:PropsLightColor) => {
    dispatch(setDarkMode(false));
    document.documentElement.style.setProperty('--theme-default', data.primary);
    document.documentElement.style.setProperty('--theme-secondary', data.secondary);
  }
  return (
    <>
      <h5>{LightLayout}</h5>
      <ul className="layout-grid customizer-color flex-row">
        {LightColorData.map((data,i)=>(
          <li className="color-layout" data-attr={`color-${i+1}`} data-primary={data.primary} onClick={()=>handleColor(data)} key={i}>
            <div></div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ColorLightLayout;

import { MixLayoutComponentProp } from '@/Types/ThemeCustomizerTypes'
import CommonUL from './CommonUL'

const BgLight :React.FC<MixLayoutComponentProp> = ({ handleCustomizerMix_Background, mixLayout }) => {
  return (
    <li className={`color-layout ${mixLayout === "light-only" ? "active" : ""}`} data-attr="light-only" onClick={() => handleCustomizerMix_Background("light-only")}>
      <div className="header bg-light">
        <CommonUL />
      </div>
      <div className="body">
        <ul>
          <li className="bg-light sidebar"></li>
          <li className="bg-light body"></li>
        </ul>
      </div>
    </li>
  )
}

export default BgLight
import { useRef } from 'react'
import { TEXT } from './TemplateConstants'
import CopyToClipboardButton from '../../Components/CopyToClipboardButton'

const FilledTemplate = ({
  chiefComplaint,
  patientDescription,
  painSideLR,
  daysAgo,
  treatmentOptions,
  pulses,
  capillaryFillTime,
  squeezeTest,
  rangeOne,
  rangeTwo,
  rangeThree,
  rangeFour,
  bilateralDiagnosis,
  side,
  timeToReturn,
}: {
  chiefComplaint: string
  patientDescription: string
  painSideLR: string
  daysAgo: string
  treatmentOptions: string
  pulses: string
  capillaryFillTime: string
  squeezeTest: string
  rangeOne: string
  rangeTwo: string
  rangeThree: string
  rangeFour: string
  bilateralDiagnosis: string
  side: string
  timeToReturn: string
}) => {
  const textRef = useRef<HTMLDivElement>(null)

  return (
    <div className="border rounded-3xl p-4 mt-4">
      <div className="flex justify-end">
        <CopyToClipboardButton targetRef={textRef} />
      </div>
      <div ref={textRef}>
        <h1 className="text-2xl font-extrabold pb-2">{TEXT.SUBJECTIVE}</h1>
        <p>
          <span className="font-extrabold">{TEXT.CHIEF}</span>
          {chiefComplaint}
        </p>
        <p>
          <span className="font-extrabold">{TEXT.HISTORY}</span>
          {patientDescription}
          {TEXT.HISTORY_WHO}
          {painSideLR}
          {TEXT.HISTORY_HEEL}
          {daysAgo}
          {TEXT.HISTORY_AGO}
          {treatmentOptions}
          {TEXT.DENIES_FALLS}
        </p>
        <br />
        <h1 className="text-2xl font-extrabold pb-2">{TEXT.PHYSICAL_EXAM}</h1>
        <p>{TEXT.GENERAL_APPEARANCE}</p>
        <p>{TEXT.LE_EXAM}</p>
        <p>
          {TEXT.VASC}
          {pulses}
          {TEXT.CAPILLARY}
          {capillaryFillTime}
          {TEXT.TIME}
        </p>
        <p>{TEXT.DERM}</p>
        <p>{TEXT.NEURO}</p>
        <p>
          {TEXT.MSK}
          {squeezeTest}
          {TEXT.HEEL}
        </p>
        <p>
          {TEXT.TTP}
          {painSideLR}
          {TEXT.MEDIAL}
          {TEXT.CALCANEAL}
        </p>
        <p>
          {TEXT.TTP}
          {painSideLR}
          {TEXT.LATERAL}
          {TEXT.CALCANEAL}
        </p>
        <p>{TEXT.TENDERNESS}</p>
        <p>{TEXT.NO_TENDERNESS}</p>

        <p>
          {TEXT.RIGHT}
          {TEXT.AJ}
          {rangeOne}
          {TEXT.DEGREE_EXTENDED}
          {rangeTwo}
          {TEXT.DEGREE_FLEXED}
        </p>
        <p>
          {TEXT.LEFT}
          {TEXT.AJ}
          {rangeThree}
          {TEXT.DEGREE_EXTENDED}
          {rangeFour}
          {TEXT.DEGREE_FLEXED}
        </p>
        <p>{TEXT.FIVE}</p>
        <p>{TEXT.JAYS}</p>
        <br />
        <p>{TEXT.ASSESSMENT_PLAN}</p>
        <br />
        <p>
          {TEXT.GASTROC}
          {bilateralDiagnosis}
          {TEXT.TOE}
        </p>
        <p>
          {TEXT.PES}
          {bilateralDiagnosis}
        </p>
        <p>
          {TEXT.PAIN}
          {side}

          {TEXT.FOOT}
        </p>
        <p>
          {TEXT.ENTHESOPATHY}
          {bilateralDiagnosis}
          {TEXT.HEEL}
        </p>
        <p>
          {TEXT.PLANTAR_FASCIITIS}
          {bilateralDiagnosis}
          {TEXT.HEEL}
        </p>
        <p>{TEXT.CONDITION_ETIOLOGY_TREATMENT}</p>
        <p>{TEXT.ADVISED_NSAIDS}</p>
        <p>{TEXT.ANTI_INFLAMMATORY}</p>
        <p>{TEXT.STRETCHING_EXERCISES}</p>
        <p>{TEXT.ICE_TO_PAINFUL_AREA}</p>
        <p>{TEXT.ADVISED_SHOES}</p>
        <p>{TEXT.NIGHT_SPLINT}</p>
        <p>{TEXT.OTC_INSERT}</p>
        <p>{TEXT.DISCUSSED_CUSTOM_INSERTS}</p>
        <p>{TEXT.SURGICAL_OPTIONS}</p>
        <p>{TEXT.STEROID_INJECTION}</p>
        <br></br>
        <p>{TEXT.PROCEDURE_NOTE}</p>
        <p>{TEXT.TIMEOUT}</p>
        <p>
          {TEXT.INJECTED}
          {painSideLR}
          {TEXT.BANDAID}
        </p>
        <p>
          {TEXT.RTC}
          {timeToReturn}
        </p>
        <p>{TEXT.DISCUSSED_SIGNS}</p>
        <p>{TEXT.CALL}</p>
      </div>
    </div>
  )
}
export default FilledTemplate

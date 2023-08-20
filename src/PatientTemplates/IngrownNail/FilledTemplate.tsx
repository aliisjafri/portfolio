import { useRef } from 'react'
import { TEXT } from './TemplateConstants'
import CopyToClipboardButton from '../../Components/CopyToClipboardButton'

const FilledTemplate = ({
  chiefComplaint,
  patientDescription,
  leftRightToe,
  daysAgo,
  medialLateral,
  pulses,
  capillaryFillTime,
  partialTotal,
  yesOrNo,
  withOrWithout,
}: {
  chiefComplaint: string
  patientDescription: string
  leftRightToe: string
  daysAgo: string
  medialLateral: string
  pulses: string
  capillaryFillTime: string
  partialTotal: string
  yesOrNo: string
  withOrWithout: string
}) => {
  const firstTextRef = useRef<HTMLDivElement>(null)
  const secondTextRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <div className="border rounded-3xl p-4 mt-4 shadow-2xl">
        <div className="flex justify-end mt-4">
          <CopyToClipboardButton targetRef={firstTextRef} />
        </div>
        <div ref={firstTextRef}>
          <h1 className="text-2xl font-extrabold pb-2">{TEXT.SUBJECTIVE}</h1>
          <p>
            <span className="font-extrabold">{TEXT.CHIEF}</span>
            {chiefComplaint}
          </p>
          <p>
            <span className="font-extrabold">{TEXT.HISTORY}</span>
            {patientDescription}
            {TEXT.HISTORY_WHO}
            {leftRightToe}
            {TEXT.HISTORY_TOE}
            {daysAgo}
            {TEXT.HISTORY_AGO}
          </p>
        </div>
      </div>
      <div className="border rounded-3xl p-4 mt-4 shadow-2xl">
        <div className="flex justify-end mt-4">
          <CopyToClipboardButton targetRef={secondTextRef} />
        </div>
        <div ref={secondTextRef}>
          <h1 className="text-2xl font-extrabold pb-2">{TEXT.PHYSICAL_EXAM}</h1>
          <p>{TEXT.GENERAL_APPEARANCE}</p>
          <p>
            {TEXT.DERM}
            {medialLateral}
            {TEXT.BORDER}
            {leftRightToe}
            {TEXT.NAIL}
            {yesOrNo}
            {TEXT.EVIDENCE}
          </p>
          <p>{TEXT.NEURO}</p>
          <p>
            {TEXT.VASC}
            {pulses}
            {TEXT.CAPILLARY}
            {capillaryFillTime}
            {TEXT.TIME}
          </p>
          <p>
            {TEXT.MS}
            {medialLateral}
            {TEXT.NAIL_BORDER}
            {leftRightToe}
            {TEXT.TOE}
          </p>
          <br />
          <p>{TEXT.ASSESSMENT_PLAN}</p>
          <p>
            {TEXT.PAIN}
            {leftRightToe}
            {TEXT.TOE}
          </p>
          <p>
            {TEXT.PARONYCHIA}
            {leftRightToe}
            {TEXT.TOE}
          </p>
          <p>
            {TEXT.HASH}
            {medialLateral}
            {TEXT.ONYCHOCRYPTOSIS}
            {leftRightToe}
            {TEXT.TOE}
          </p>
          <p>{TEXT.DISCUSSED}</p>
          <p>{TEXT.TREATMENT_OPTIONS}</p>
          <p>
            {TEXT.PT_PROCEDURE}
            {partialTotal}
            {TEXT.PT_INSTRUCTION}
            {withOrWithout}
            {TEXT.EXPLAINED}
          </p>
          <p>{TEXT.SEE_PROCEDURE_NOTE}</p>
          <p>{TEXT.POST_CARE}</p>
          <p>{TEXT.HANDOUT}</p>
          <p>{TEXT.INFECTION_SIGNS}</p>
          <p>{TEXT.RTC}</p>

          <p>
            {TEXT.PROCEDURE_NOTE}
            {leftRightToe}
            {TEXT.TOE_FORM}
            {partialTotal}
            {TEXT.NAIL_AVULSION}
            {withOrWithout}
            {TEXT.PHENOL}
          </p>
        </div>
      </div>
    </div>
  )
}
export default FilledTemplate

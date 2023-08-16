import { useRef } from 'react'
import { TEXT } from './TemplateConstants'
import CopyToClipboardButton from '../../Components/CopyToClipboardButton'
import { motion } from 'framer-motion'

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
  timeToReturn: string
}) => {
  const firstTextRef = useRef<HTMLDivElement>(null)
  const secondTextRef = useRef<HTMLDivElement>(null)

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="border rounded-3xl p-4 mt-4 shadow-2xl"
      >
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
            {painSideLR}
            {TEXT.HISTORY_HEEL}
            {daysAgo}
            {TEXT.HISTORY_AGO}
            {treatmentOptions}
            {TEXT.DENIES_FALLS}
          </p>
        </div>
      </motion.div>
      <br />
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className="border rounded-3xl p-4 mt-4 shadow-2xl"
      >
        <div className="flex justify-end mt-4">
          <CopyToClipboardButton targetRef={secondTextRef} />
        </div>
        <div ref={secondTextRef}>
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
          <p>
            {TEXT.GASTROC}
            {bilateralDiagnosis}
          </p>
          <p>
            {TEXT.PES}
            {bilateralDiagnosis}
          </p>
          <p>
            {TEXT.PAIN}
            {painSideLR}
            {TEXT.FOOT}
          </p>
          <p>
            {TEXT.ENTHESOPATHY}
            {painSideLR}
            {TEXT.HEEL}
          </p>
          <p>
            {TEXT.PLANTAR_FASCIITIS}
            {painSideLR}
            {TEXT.HEEL}
          </p>
          <br></br>
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
      </motion.div>
    </div>
  )
}
export default FilledTemplate

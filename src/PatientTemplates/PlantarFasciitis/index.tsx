import { useState, useEffect, FormEvent } from 'react'
import InputField from '../../Components/InputField'
import { TEXT } from './TemplateConstants'
import FilledTemplate from './FilledTemplate'
import { motion } from 'framer-motion'
import MotionButton from '../../Components/MotionButton'

const PlantarFasciitis = () => {
  const initialFieldState = {
    chiefComplaint: '',
    patientDescription: '',
    painSideLR: '',
    daysAgo: '',
    treatmentOptions: '',
    pulses: '',
    capillaryFillTime: '',
    squeezeTest: 'bilateral',
    rangeOne: '',
    rangeTwo: '',
    rangeThree: '',
    rangeFour: '',
    bilateralDiagnosis: 'bilateral',
    side: '',
    timeToReturn: '',
  }
  const [fields, setFields] = useState(initialFieldState)
  const [submit, setSubmit] = useState(false)
  const updateState = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFields({
      ...fields,
      [name]: value,
    })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmit(true)
  }
  useEffect(() => {
    if (submit) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [submit])

  return (
    <div className="pt-4 leading-7 text-white">
      {submit && (
        <div className="flex justify-end gap-3">
          <MotionButton onClick={() => setSubmit(false)}>Edit</MotionButton>
          <MotionButton
            onClick={() => {
              setFields(initialFieldState)
              setSubmit(false)
            }}
          >
            Clear
          </MotionButton>
        </div>
      )}
      {!submit && (
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl font-extrabold pb-2">{TEXT.SUBJECTIVE}</h1>
          <p>
            <span className="font-extrabold">{TEXT.CHIEF}</span>
            <InputField
              name="chiefComplaint"
              value={fields.chiefComplaint}
              placeholder="Chief Complaint"
              onChange={updateState}
            />
          </p>
          <p>
            <span className="font-extrabold">{TEXT.HISTORY}</span>
            <InputField
              name="patientDescription"
              value={fields.patientDescription}
              placeholder="@NAME@ is a @AGE@ @SEX@"
              onChange={updateState}
            />
            {TEXT.HISTORY_WHO}
            <InputField
              value={fields.painSideLR}
              name="painSideLR"
              placeholder="L / R"
              onChange={updateState}
            />
            {TEXT.HISTORY_HEEL}
            <InputField
              value={fields.daysAgo}
              name="daysAgo"
              placeholder="days ago"
              onChange={updateState}
            />
            {TEXT.HISTORY_AGO}
            <InputField
              value={fields.treatmentOptions}
              name="treatmentOptions"
              placeholder="treatment options"
              onChange={updateState}
            />
            {TEXT.DENIES_FALLS}
          </p>
          <br />
          <h1 className="text-2xl font-extrabold pb-2">{TEXT.PHYSICAL_EXAM}</h1>
          <p>{TEXT.GENERAL_APPEARANCE}</p>
          <br />
          <p>{TEXT.LE_EXAM}</p>
          <p>
            {TEXT.VASC}
            <InputField
              value={fields.pulses}
              name="pulses"
              placeholder="DP / PT Palpable ?"
              onChange={updateState}
            />
            {TEXT.CAPILLARY}
            <InputField
              value={fields.capillaryFillTime}
              name="capillaryFillTime"
              placeholder="less than / greater than"
              onChange={updateState}
            />
            {TEXT.TIME}
          </p>
          <br />
          <p>{TEXT.DERM}</p>
          <br />
          <p>{TEXT.NEURO}</p>
          <br />
          <p>
            {TEXT.MSK}
            <InputField
              value={fields.squeezeTest}
              name="squeezeTest"
              placeholder="bilateral side?"
              onChange={updateState}
            />
            {TEXT.HEEL}
          </p>
          <p>
            {TEXT.TTP}
            {` [${fields.painSideLR}] `}
            {TEXT.MEDIAL}
            {TEXT.CALCANEAL}
          </p>
          <p>
            {TEXT.TTP}
            {` [${fields.painSideLR}] `}
            {TEXT.LATERAL}
            {TEXT.CALCANEAL}
          </p>
          <p>{TEXT.TENDERNESS}</p>
          <p>{TEXT.NO_TENDERNESS}</p>

          <p>
            {TEXT.RIGHT}
            {TEXT.AJ}
            <InputField
              value={fields.rangeOne}
              name="rangeOne"
              placeholder="range one"
              onChange={updateState}
            />
            {TEXT.DEGREE_EXTENDED}
            <InputField
              value={fields.rangeTwo}
              name="rangeTwo"
              placeholder="range two"
              onChange={updateState}
            />
            {TEXT.DEGREE_FLEXED}
          </p>
          <p>
            {TEXT.LEFT}
            {TEXT.AJ}
            <InputField
              value={fields.rangeThree}
              name="rangeThree"
              placeholder="range three"
              onChange={updateState}
            />
            {TEXT.DEGREE_EXTENDED}
            <InputField
              value={fields.rangeFour}
              name="rangeFour"
              placeholder="range four"
              onChange={updateState}
            />
          </p>
          <p>{TEXT.FIVE}</p>
          <p>{TEXT.JAYS}</p>
          <br />
          <p>{TEXT.ASSESSMENT_PLAN}</p>
          <br />
          <p>
            {TEXT.GASTROC}
            <InputField
              value={fields.bilateralDiagnosis}
              name="bilateralDiagnosis"
              placeholder="bilateral ?"
              onChange={updateState}
            />
            {TEXT.TOE}
          </p>
          <p>
            {TEXT.PES}
            {`[ ${fields.bilateralDiagnosis} ]`}
          </p>
          <p>
            {TEXT.PAIN}
            <InputField
              value={fields.side}
              name="side"
              placeholder="L / R"
              onChange={updateState}
            />
            {TEXT.FOOT}
          </p>
          <p>
            {TEXT.ENTHESOPATHY}
            {` [ ${fields.bilateralDiagnosis} ] `}
            {TEXT.HEEL}
          </p>
          <p>
            {TEXT.PLANTAR_FASCIITIS}
            {` [ ${fields.bilateralDiagnosis} ] `}
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
            {`[ ${fields.painSideLR} ]`}
            {TEXT.BANDAID}
          </p>
          <p>
            {TEXT.RTC}
            <InputField
              value={fields.timeToReturn}
              name="timeToReturn"
              placeholder="time - weeks / months"
              onChange={updateState}
            />
          </p>
          <p>{TEXT.DISCUSSED_SIGNS}</p>
          <p>{TEXT.CALL}</p>
          <div className="flex justify-end">
            <MotionButton>Submit</MotionButton>
          </div>
        </form>
      )}
      {submit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FilledTemplate {...fields} />
        </motion.div>
      )}
    </div>
  )
}

export default PlantarFasciitis

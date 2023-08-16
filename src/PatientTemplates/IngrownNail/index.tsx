import { useState, useEffect, FormEvent } from 'react'
import FilledTemplate from './FilledTemplate'
import InputField from '../../Components/InputField'
import { TEXT } from './TemplateConstants'
import { motion } from 'framer-motion'
import MotionButton from '../../Components/MotionButton'

const IngrownNail = () => {
  const initialFieldState = {
    chiefComplaint: '',
    patientDescription: '',
    leftRightToe: '',
    daysAgo: '',
    medialLateral: '',
    pulses: '',
    capillaryFillTime: '',
    partialTotal: '',
    withOrWithout: '',
    yesOrNo: '',
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
              value={fields.leftRightToe}
              name="leftRightToe"
              placeholder="L / R"
              onChange={updateState}
            />
            {TEXT.HISTORY_TOE}
            <InputField
              value={fields.daysAgo}
              name="daysAgo"
              placeholder="days ago"
              onChange={updateState}
            />
            {TEXT.HISTORY_AGO}
          </p>
          <br />
          <h1 className="text-2xl font-extrabold pb-2">{TEXT.PHYSICAL_EXAM}</h1>
          <p>{TEXT.GENERAL_APPEARANCE}</p>
          <br />
          <p>
            {TEXT.DERM}
            <InputField
              value={fields.medialLateral}
              name="medialLateral"
              placeholder="medial / lateral"
              onChange={updateState}
            />
            {TEXT.BORDER}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.NAIL}
            <InputField
              value={fields.yesOrNo}
              name="yesOrNo"
              placeholder="Yes / No "
              onChange={updateState}
            />
            {TEXT.EVIDENCE}
          </p>
          <br />
          <p>{TEXT.NEURO}</p>
          <br />
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
          <p>
            {TEXT.MS}
            {` [ ${fields.medialLateral} ]`}
            {TEXT.NAIL_BORDER}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.TOE}
          </p>
          <br />
          <p>{TEXT.ASSESSMENT_PLAN}</p>
          <br />
          <p>
            {TEXT.PAIN}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.TOE}
          </p>
          <p>
            {TEXT.PARONYCHIA}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.TOE}
          </p>
          <p>
            {TEXT.HASH}
            {` [ ${fields.medialLateral} ] `}
            {TEXT.ONYCHOCRYPTOSIS}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.TOE}
          </p>
          <p>{TEXT.DISCUSSED}</p>
          <p>{TEXT.TREATMENT_OPTIONS}</p>
          <p>
            {TEXT.PT_PROCEDURE}
            <InputField
              value={fields.partialTotal}
              name="partialTotal"
              placeholder="partial / total"
              onChange={updateState}
            />
            {TEXT.PT_INSTRUCTION}
            <InputField
              value={fields.withOrWithout}
              name="withOrWithout"
              placeholder="with / without"
              onChange={updateState}
            />
            {TEXT.EXPLAINED}
          </p>
          <p>{TEXT.SEE_PROCEDURE_NOTE}</p>
          <p>{TEXT.POST_CARE}</p>
          <p>{TEXT.HANDOUT}</p>
          <p>{TEXT.INFECTION_SIGNS}</p>
          <p>{TEXT.RTC}</p>
          <p>
            {TEXT.PROCEDURE_NOTE}
            {`[ ${fields.leftRightToe} ]`}
            {TEXT.TOE_FORM}
            {`[ ${fields.partialTotal} ]`}
            {TEXT.NAIL_AVULSION}
            {`[ ${fields.withOrWithout} ]`}
            {TEXT.PHENOL}
          </p>
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

export default IngrownNail

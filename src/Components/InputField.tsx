const InputField = ({
  value,
  name,
  placeholder,
  width,
  onChange,
}: {
  value: string
  name: string
  placeholder: string
  width?: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <input
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`mx-2 text-sm p-1 h-6 rounded-md text-black ${width}`}
    required
  ></input>
)
export default InputField

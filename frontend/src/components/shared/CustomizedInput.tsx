import React from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";

type CustomizedInputProps = TextFieldProps & {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};


const CustomizedInput: React.FC<CustomizedInputProps> = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  ...rest
}) => {
  return (
    <TextField
      fullWidth
      margin="normal"
      variant="outlined"
      type={type}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};

export default CustomizedInput;

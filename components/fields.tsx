import { ChangeEvent, ComponentProps, FC, useMemo } from "react";

import { useField } from "hooked-form";

import {
  As,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";

interface FieldProps {
  fieldId: string;
  label: string;
  placeholder: string;
  as?: As<any>;
}

type FieldWrapperProps = {
  fieldId: string;
  label: string;
  validation: (v: any) => string | undefined;
  children: (p: {
    onChange: (v: any) => void;
    onBlur: () => void;
    onFocus: () => void;
    value: any;
  }) => any;
};

const FieldWrapper: FC<FieldWrapperProps> = ({
  fieldId,
  validation,
  label,
  children,
}) => {
  const [{ onChange, onBlur, onFocus }, { value, touched, error }] = useField(
    fieldId,
    validation
  );
  const _children = useMemo(
    () => children({ onChange, onBlur, onFocus, value }),
    [children, onBlur, onChange, onFocus, value]
  );
  return (
    <FormControl isInvalid={touched && !!error}>
      <FormLabel htmlFor={fieldId} mt={2}>
        {label}
      </FormLabel>
      {_children}
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export const Field: FC<FieldProps> = ({
  fieldId,
  label,
  placeholder,
  as: As = Input,
}) => (
  <FieldWrapper
    fieldId={fieldId}
    label={label}
    validation={(v = "") =>
      !v.length ? "This input must have a value" : undefined
    }
  >
    {({ onBlur, onFocus, onChange, value }) => (
      <As
        id={fieldId}
        onBlur={onBlur}
        onFocus={onFocus}
        onChange={(e: ChangeEvent<ComponentProps<"input">>) =>
          onChange(e.target.value)
        }
        value={value}
        placeholder={placeholder}
      />
    )}
  </FieldWrapper>
);

export const NumberField: FC<FieldProps> = ({
  fieldId,
  label,
  placeholder,
}) => (
  <FieldWrapper
    fieldId={fieldId}
    label={label}
    validation={(v = 0) =>
      v < 0 ? "The amount must be bigger than 0" : undefined
    }
  >
    {({ onBlur, onFocus, onChange, value }) => (
      <NumberInput>
        <NumberInputField
          id={fieldId}
          onBlur={onBlur}
          onFocus={onFocus}
          onChange={e => onChange(parseFloat(e.target.value))}
          value={value}
          placeholder={placeholder}
          min={0}
        />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    )}
  </FieldWrapper>
);

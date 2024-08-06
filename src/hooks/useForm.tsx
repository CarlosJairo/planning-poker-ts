import { FormEvent, useEffect, useState } from "react";

interface UseFormProps<T> {
  defaultValues: T;
  resolver?: (values: T) => Promise<void> | void;
}

export function useForm<T extends object>({
  defaultValues,
  resolver,
}: UseFormProps<T>) {
  const [formValue, setFormValue] = useState<T>(defaultValues);
  const [isError, setIsError] = useState(false);
  const [messageError, setMessageError] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );

  useEffect(() => {
    const resolve = async () => {
      if (resolver) {
        try {
          await resolver(formValue);
          setIsError(false);
          setMessageError({} as Record<keyof T, string>);
        } catch (errors: any) {
          setIsError(true);
          setMessageError(errors);
        }
      }
    };

    resolve();
  }, [formValue, resolver]);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, type, value, checked, files } = event.currentTarget;
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
    }));
  };

  const cleanFormValues = () => setFormValue(defaultValues);
  const resetInputValue = (name: keyof T) =>
    setFormValue({ ...formValue, [name]: "" });

  return {
    formValue,
    isError,
    messageError,
    handleChange,
    cleanFormValues,
    resetInputValue,
  };
}

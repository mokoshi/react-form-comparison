"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import type { FieldApi } from "@tanstack/react-form";
import { Button } from "@mui/material";
import { sleep } from "../utils";

const hobbies = [
  "reading",
  "cooking",
  "running",
  "painting",
  "traveling",
] as const;

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  age: z.number().min(10),
  hobbies: z
    .array(z.enum(hobbies))
    .length(2, { message: "2つだけ選択してください" }),
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export default function Page() {
  const form = useForm<z.infer<typeof schema>, any /* 👺 */>({
    // ↓むり👺
    // defaultValues: async () => {
    //   await sleep(3000);
    //   return {
    //     username: "もこし",
    //     age: "100",
    //   };
    // },
    defaultValues: {
      name: "",
      age: 0,
      hobbies: [],
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
    // Add a validator to support Zod usage in Form and Field
    validatorAdapter: zodValidator,
  });

  React.useEffect(() => {
    async function init() {
      // 👺
      await sleep(3000);
      form.setFieldValue("name", "もこし");
      form.setFieldValue("age", 100);
      form.setFieldValue("hobbies", [hobbies[1], hobbies[3]]);
    }
    init();
  }, [form]);

  return (
    <div className="p-4">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">User Information</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Please fill in your details
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <form.Field
                  name="name"
                  validators={{ onChange: schema.shape.name }}
                >
                  {(field) => (
                    <>
                      <label htmlFor={field.name} className="block">
                        User name
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                </form.Field>
              </div>
              <div className="space-y-2">
                <form.Field
                  name="age"
                  validators={{ onChange: schema.shape.age }}
                >
                  {(field) => (
                    <>
                      <label htmlFor={field.name} className="block">
                        Age
                      </label>
                      <input
                        id={field.name}
                        type="number"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(parseInt(e.target.value))
                        }
                      />
                      <FieldInfo field={field} />
                    </>
                  )}
                </form.Field>
              </div>
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </form.Provider>
    </div>
  );
}

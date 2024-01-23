"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { sleep } from "../utils";
import { DevTool } from "@hookform/devtools";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

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

const Page = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isLoading, errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: async () => {
      await sleep(3000);
      return {
        name: "もこし",
        age: 100,
        hobbies: [hobbies[1], hobbies[3]],
      };
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  // const disabled = false;
  const disabled = isLoading;

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit((d) => console.log(d))}>
        <div className="mx-auto max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">User Information</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Please fill in your details
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block">
                User name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                disabled={disabled}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500">
                  {errors.name?.message?.toString()}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="block">
                Age
              </label>
              <input
                id="age"
                type="number"
                disabled={disabled}
                {...register("age")}
              />
              {errors.age && (
                <p className="text-red-500">
                  {errors.age?.message?.toString()}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <FormControl fullWidth>
                <InputLabel id="hobbies-label" htmlFor="hobby">
                  Hobby
                </InputLabel>
                <Select
                  labelId="hobbies-label"
                  multiple
                  variant="standard"
                  value={watch("hobbies") ?? []}
                  disabled={disabled}
                  {...register("hobbies")}
                >
                  {hobbies.map((hobby) => (
                    <MenuItem key={hobby} value={hobby}>
                      {hobby}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.age && (
                <p className="text-red-500">
                  {errors.hobbies?.message?.toString()}
                </p>
              )}
            </div>
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </div>
        </div>
        <DevTool control={control} />
      </form>
    </div>
  );
};

export default Page;

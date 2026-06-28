"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: ""
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response.data.id}`);
      toast.success("Course created");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return ( 
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 mt-8"
        >
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Course title
                </FieldLabel>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. 'Advanced web development'"
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                <FieldDescription>
                  What will you teach in this course?
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Link href="/">
              <Button
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
   );
}
 
export default CreatePage;
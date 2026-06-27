"use client";

import { useState, useTransition } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";
import {
  HelpCircle,
  ImageIcon,
  Settings,
  Upload,
  XCircle,
} from "lucide-react";

import { Profile } from "@/actions/profile";
import { FileUpload } from "@/components/file-upload";
import { FormError } from "@/components/form-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { ProfileSchema } from "@/schemas";

const ProfilePage = () => {
  const {
    data: sessionData,
    isPending: isSessionPending,
    refetch,
  } = authClient.useSession();
  const user = sessionData?.user as any;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [toggleEdit, setToggleEdit] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      image: user?.image || undefined,
      password: undefined,
    },
  });

  if (isSessionPending) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return redirect("/");
  }

  const onSubmit = (
    values: z.infer<typeof ProfileSchema>,
  ) => {
    startTransition(() => {
      if (
        form.getValues("name") === user?.name &&
        form.getValues("email") === user?.email &&
        form.getValues("image") === user?.image &&
        form.getValues("password") === undefined
      ) {
        toast.success("All fields are up to date");
        router.refresh();
        return;
      }
      Profile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
            form.reset();
            form.setValue("password", "");
          }
          if (data.success) {
            refetch();
            toast.success(data.success);
            setToggleEdit(false);
          }
          router.refresh();
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  const cancelImageForm = () => {
    form.setValue("image", user?.image || undefined);
    setToggleEdit(false);
  };

  return (
    <Card className="lg:w-187.5 xl:w-250 mx-auto border border-border bg-card/60 backdrop-blur-md shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-center gap-2 py-4">
          <Settings className="h-8 w-8 text-primary animate-spin-slow" />
          <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
            Settings
          </h1>
        </div>
      </CardHeader>
      <CardContent className="p-6 md:p-8">
        <form
          className="space-y-8"
          onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Controller
              name="image"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-border/60 bg-muted/30">
                  <div className="flex items-center justify-between w-full mb-4">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-lg font-semibold flex items-center gap-1.5">
                      Profile Image
                      {form.watch("image") !==
                        user?.image &&
                        form.watch("image") !==
                          undefined && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                    </FieldLabel>
                    {!toggleEdit ? (
                      <Button
                        onClick={() =>
                          setToggleEdit((prev) => !prev)
                        }
                        className="flex rounded-md"
                        type="button"
                        variant="secondary"
                        size="sm">
                        Upload
                        <Upload className="ml-1.5 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={cancelImageForm}
                        className="flex rounded-md"
                        type="button"
                        variant="ghost"
                        size="sm">
                        Cancel{" "}
                        <XCircle className="ml-1.5 h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  {!toggleEdit &&
                    (!user?.image ? (
                      <div className="flex items-center justify-center h-32 w-32 bg-muted/80 rounded-full border border-border shadow-inner">
                        <ImageIcon className="h-10 w-10 text-muted-foreground/60" />
                      </div>
                    ) : (
                      <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-primary/20 shadow-md">
                        <Image
                          alt="User Profile"
                          fill
                          className="object-cover rounded-full"
                          src={user.image}
                        />
                      </div>
                    ))}
                  {toggleEdit && (
                    <div className="w-full max-w-md">
                      <FileUpload
                        endpoint="userImage"
                        onChange={(url) => {
                          if (url) {
                            form.setValue("image", url, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }
                        }}
                      />
                      <FieldDescription className="text-center mt-2 text-xs text-muted-foreground">
                        1:1 aspect ratio recommended
                      </FieldDescription>
                    </div>
                  )}
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="mt-2"
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor={field.name}
                    className="text-base font-medium flex items-center gap-1.5">
                    Name
                    {form.watch("name") !== user?.name && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    disabled={isPending}
                    autoComplete="name"
                    className="h-11 bg-background/50 border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-base font-medium flex items-center gap-1.5">
                      Email
                      {form.watch("email") !==
                        user?.email && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </FieldLabel>
                    {user?.isOAuth && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            className="focus:outline-none">
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This field is handled by your
                              OAuth provider
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="johndoe@gmail.com"
                    disabled={isPending || user!.isOAuth}
                    type="email"
                    autoComplete="email"
                    className="h-11 bg-background/50 border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center gap-2">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-base font-medium flex items-center gap-1.5">
                      Password
                      {form.watch("password") && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </FieldLabel>
                    {user?.isOAuth && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger
                            type="button"
                            className="focus:outline-none">
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This field is handled by your
                              OAuth provider
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="******"
                    disabled={isPending || user!.isOAuth}
                    autoComplete="new-password"
                    className="h-11 bg-background/50 border-border focus-visible:ring-primary"
                  />
                  {fieldState.invalid && (
                    <FieldError
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <FormError message={error} />

            <div className="flex items-center gap-3 pt-4">
              <Button
                disabled={isPending}
                type="submit"
                className="px-6 h-11 font-medium transition-all shadow-sm hover:shadow">
                Save
              </Button>
              <Button
                disabled={isPending}
                variant="outline"
                onClick={() => {
                  form.setValue(
                    "name",
                    user?.name || undefined,
                  );
                  form.setValue(
                    "email",
                    user?.email || undefined,
                  );
                  form.setValue(
                    "image",
                    user?.image || undefined,
                  );
                  cancelImageForm();
                  form.setValue("password", undefined);
                }}
                type="button"
                className="px-6 h-11 font-medium">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfilePage;

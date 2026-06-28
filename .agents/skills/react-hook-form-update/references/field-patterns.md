# Field Patterns Reference

Complete code examples for every field type in the new shadcn Field + Controller API.

---

## Input

```tsx
<Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Textarea

```tsx
<Controller
  name="bio"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
      <Textarea
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        className="min-h-[120px]"
      />
      <FieldDescription>Tell us about yourself.</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Select

Use `field.value` and `field.onChange` (not spread) on `<Select>`.
Put `aria-invalid` on `<SelectTrigger>`.

```tsx
<Controller
  name="language"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Language</FieldLabel>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger
          id={field.name}
          aria-invalid={fieldState.invalid}
        >
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">French</SelectItem>
        </SelectContent>
      </Select>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

For horizontal layout (label left, control right):

```tsx
<Field orientation="responsive" data-invalid={fieldState.invalid}>
  <FieldContent>
    <FieldLabel htmlFor={field.name}>Language</FieldLabel>
    <FieldDescription>Choose your preferred language.</FieldDescription>
    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
  </FieldContent>
  <Select ...>...</Select>
</Field>
```

---

## Checkbox (single)

Use `checked={field.value}` and `onCheckedChange={field.onChange}`.

```tsx
<Controller
  name="terms"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.value}
        onCheckedChange={field.onChange}
        aria-invalid={fieldState.invalid}
      />
      <FieldLabel htmlFor={field.name}>
        I agree to the terms and conditions
      </FieldLabel>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

---

## Checkbox Array

Use `<FieldSet>`, `<FieldLegend>`, `<FieldGroup data-slot="checkbox-group">`.
Manage checked state with array manipulation.

```tsx
const items = [
  { id: "email", label: "Email notifications" },
  { id: "sms", label: "SMS notifications" },
]

<Controller
  name="notifications"
  control={form.control}
  render={({ field, fieldState }) => (
    <FieldSet>
      <FieldLegend variant="label">Notifications</FieldLegend>
      <FieldDescription>Choose how you want to be notified.</FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {items.map((item) => (
          <Field
            key={item.id}
            orientation="horizontal"
            data-invalid={fieldState.invalid}
          >
            <Checkbox
              id={`notifications-${item.id}`}
              name={field.name}
              aria-invalid={fieldState.invalid}
              checked={field.value.includes(item.id)}
              onCheckedChange={(checked) => {
                const next = checked
                  ? [...field.value, item.id]
                  : field.value.filter((v) => v !== item.id)
                field.onChange(next)
              }}
            />
            <FieldLabel htmlFor={`notifications-${item.id}`} className="font-normal">
              {item.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )}
/>
```

Zod schema for checkbox arrays:
```tsx
notifications: z.array(z.string()).min(1, "Select at least one option."),
```

---

## Radio Group

Use `value={field.value}` and `onValueChange={field.onChange}` on `<RadioGroup>`.

```tsx
const plans = [
  { id: "free", title: "Free", description: "Basic features" },
  { id: "pro", title: "Pro", description: "All features" },
]

<Controller
  name="plan"
  control={form.control}
  render={({ field, fieldState }) => (
    <FieldSet>
      <FieldLegend>Plan</FieldLegend>
      <RadioGroup
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        {plans.map((plan) => (
          <FieldLabel key={plan.id} htmlFor={`plan-${plan.id}`}>
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldTitle>{plan.title}</FieldTitle>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={plan.id}
                id={`plan-${plan.id}`}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )}
/>
```

---

## Switch

Use `checked={field.value}` and `onCheckedChange={field.onChange}`.
Typically uses `orientation="horizontal"` with `<FieldContent>` for the text side.

```tsx
<Controller
  name="marketing"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor={field.name}>Marketing emails</FieldLabel>
        <FieldDescription>
          Receive emails about new products and features.
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
      <Switch
        id={field.name}
        name={field.name}
        checked={field.value}
        onCheckedChange={field.onChange}
        aria-invalid={fieldState.invalid}
      />
    </Field>
  )}
/>
```

---

## Array Fields (useFieldArray)

```tsx
import { useFieldArray, useForm } from "react-hook-form"

const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "emails",
})

// Zod schema
const formSchema = z.object({
  emails: z
    .array(z.object({ address: z.string().email("Enter a valid email.") }))
    .min(1, "Add at least one email.")
    .max(5, "Maximum 5 emails."),
})
```

Render:
```tsx
<FieldSet className="gap-4">
  <FieldLegend variant="label">Email Addresses</FieldLegend>
  <FieldDescription>Add up to 5 email addresses.</FieldDescription>
  <FieldGroup className="gap-4">
    {fields.map((arrayField, index) => (
      <Controller
        key={arrayField.id}  // IMPORTANT: use arrayField.id not index
        name={`emails.${index}.address`}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field orientation="horizontal" data-invalid={fieldState.invalid}>
            <FieldContent>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={`email-${index}`}
                  aria-invalid={fieldState.invalid}
                  placeholder="name@example.com"
                  type="email"
                />
                {fields.length > 1 && (
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => remove(index)}
                      aria-label={`Remove email ${index + 1}`}
                    >
                      <XIcon />
                    </InputGroupButton>
                  </InputGroupAddon>
                )}
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />
    ))}
  </FieldGroup>
  <Button
    type="button"
    variant="outline"
    size="sm"
    onClick={() => append({ address: "" })}
    disabled={fields.length >= 5}
  >
    Add Email Address
  </Button>
</FieldSet>
```

---

## Form Shell

The old `<Form>` wrapper is dropped. Use a plain `<form>`:

```tsx
export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { /* ... */ },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Controller fields here */}
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
```
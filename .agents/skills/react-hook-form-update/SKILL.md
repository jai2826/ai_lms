---
name: react-hook-form-update
description: >
  Migrates old shadcn/ui Form components (FormField, FormItem, FormLabel,
  FormControl, FormDescription, FormMessage) to the new shadcn/ui Field API
  (Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet,
  FieldLegend, FieldContent) paired with React Hook Form's Controller component
  pattern. Use this skill whenever the user wants to upgrade, migrate, convert,
  or refactor shadcn form components, mentions "old shadcn form", "new Field
  API", "antigravity", or asks to update forms to use Controller + Field.
  Trigger even if the user just pastes a form component and asks to "update it"
  or "modernize it".
---

# Antigravity — shadcn Form → Field Migration Skill

Converts legacy shadcn/ui `<Form*>` components to the modern `<Field />` API
with React Hook Form `<Controller />` pattern.

## Key Conceptual Shift

| Old pattern | New pattern |
|---|---|
| `<FormField control={form.control} name="x" render={({ field }) => ...}>` | `<Controller name="x" control={form.control} render={({ field, fieldState }) => ...}>` |
| `<FormItem>` | `<Field>` (add `data-invalid={fieldState.invalid}`) |
| `<FormLabel>` | `<FieldLabel htmlFor={field.name}>` |
| `<FormControl>` | removed — spread `{...field}` directly onto the input |
| `<FormDescription>` | `<FieldDescription>` |
| `<FormMessage />` | `{fieldState.invalid && <FieldError errors={[fieldState.error]} />}` |
| `useFormField()` | not needed — use `fieldState` from `Controller` render prop |

## Step-by-Step Migration Process

### 1. Update imports

Remove old shadcn form imports:
```tsx
// REMOVE
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
```

Add new imports:
```tsx
// ADD
import { Controller } from "react-hook-form"
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,       // for groups of checkboxes/radios
  FieldSet,         // for fieldset wrapper (checkboxes, radios)
  FieldLegend,      // for fieldset legend
  FieldContent,     // for horizontal layouts (label + control side by side)
} from "@/components/ui/field"
```

Keep `useForm`, `zodResolver`, and the form schema imports — those don't change.

The `<Form>` wrapper component itself can be replaced with a plain `<form>` tag.

### 2. Replace FormField → Controller

```tsx
// BEFORE
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>Your email address.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

// AFTER
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      <FieldDescription>Your email address.</FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### 3. Field-type-specific patterns

Read `references/field-patterns.md` for detailed examples of:
- Input
- Textarea
- Select
- Checkbox (single and arrays)
- Radio Group
- Switch
- Array fields with `useFieldArray`

### 4. Orientation and layout props

- Vertical (default): `<Field>` — label above input
- Horizontal (label + control side by side): `<Field orientation="horizontal">` with `<FieldContent>` wrapping the text side
- Responsive: `<Field orientation="responsive">` — stacks vertically on mobile, horizontal on desktop

### 5. Accessibility requirements

Every migrated field must have:
- `data-invalid={fieldState.invalid}` on `<Field>` (drives error styling)
- `aria-invalid={fieldState.invalid}` on the actual input/control
- `id={field.name}` on the control + matching `htmlFor={field.name}` on `<FieldLabel>`

### 6. Form wrapper

```tsx
// BEFORE
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>...</form>
</Form>

// AFTER
<form onSubmit={form.handleSubmit(onSubmit)}>...</form>
```

The `<Form>` wrapper is no longer needed — React Hook Form's `useForm` context
is consumed directly via `Controller`'s `control` prop.

## Output Expectations

- Complete file replacement (no partial diffs)
- All imports updated
- All FormField instances converted to Controller
- Accessibility attributes present on every field
- Original Zod schema and `useForm` config unchanged
- TypeScript types preserved

## Reference files

- `references/field-patterns.md` — Full code examples for every field type
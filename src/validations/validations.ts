import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().uuid(),
  // username: z
  //   .string()
  //   .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato inválido(123.456.789-00)')
  //   .refine(
  //     (value) => {
  //       const cleanDigits = value.replace(/[^\d]/g, '')

  //       if (cleanDigits.length !== 11) {
  //         return false
  //       }

  //       const calculateDigit = (digits: number[], weights: number[]) => {
  //         const sum = digits.reduce(
  //           (acc, digit, index) => acc + digit * weights[index],
  //           0,
  //         )
  //         const result = sum % 11
  //         return result < 2 ? 0 : 11 - result
  //       }

  //       const cpfDigits = cleanDigits.slice(0, 9).split('').map(Number)
  //       const firstDigit = calculateDigit(
  //         cpfDigits,
  //         [10, 9, 8, 7, 6, 5, 4, 3, 2],
  //       )

  //       const cpfWithFirstDigit = cleanDigits.slice(0, 10).split('').map(Number)
  //       const lastDigit = calculateDigit(
  //         cpfWithFirstDigit,
  //         [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
  //       )

  //       return (
  //         Number(cleanDigits[9]) === firstDigit &&
  //         Number(cleanDigits[10]) === lastDigit
  //       )
  //     },
  //     { message: 'CPF inválido' },
  //   ),
  username: z
    .string()
    .regex(/^[0-9]+$/, 'Deve conter apenas números')
    .min(4, 'Mínimo de 4 caracteres')
    .max(10, 'Máximo de 10 caracteres'),
  password: z.string().min(1, 'Mínimo de 1 caracter'),
  name: z
    .string()
    .regex(/^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/, 'Nome inválido(Joe)'),
  lastName: z
    .string()
    .regex(
      /^[A-ZÁÉÍÓÚÃÕÂÊÎÔÇ][a-záéíóúãõâêîôç]+$/,
      'Sobrenome inválido(Silva)',
    ),
  admin: z.boolean(),
})
export type UserSchemaType = z.infer<typeof userSchema>

export const deleteUserSchema = userSchema.pick({
  id: true,
})
export type DeleteUserSchemaType = z.infer<typeof deleteUserSchema>

export type GetUserType = Pick<
  UserSchemaType,
  'id' | 'name' | 'lastName' | 'username'
>

export const loginUserFormSchema = z.object({
  username: z.string().min(1, 'Mínimo de 1 caracter'),
  password: z.string().min(1, 'Mínimo de 1 caracter'),
})
export type LoginUserFormSchemaType = z.infer<typeof loginUserFormSchema>

export const registerUserFormSchema = userSchema
  .pick({
    username: true,
    name: true,
    lastName: true,
  })
  .extend({
    password: z.string().min(5, 'Mínimo de 5 caracteres'),
    confirmPassword: z.string().min(1, 'Mínimo de 1 caracter'),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) return false
      return true
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    },
  )
export type RegisterUserFormSchemaType = z.infer<typeof registerUserFormSchema>

export const useMeSchema = userSchema.pick({
  id: true,
  username: true,
  name: true,
  lastName: true,
  admin: true,
})
export type UseMeType = z.infer<typeof useMeSchema>

export const editUserFormSchema = z
  .object({
    name: z.string().min(3, 'Mínimo de 3 caracteres').optional(),
    lastName: z.string().min(3, 'Mínimo de 3 caracteres').optional(),
    password: z.string().optional(),
    lastPassword: z.string(),
    confirmPassword: z.string().optional(),
    image: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password !== data.confirmPassword) return false
      return true
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    },
  )
export type EditUserFormSchemaType = z.infer<typeof editUserFormSchema>

export const itemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Deve conter ao menos 2 caracteres'),
  amount: z.number().default(0),
  totalAmount: z
    .number({
      invalid_type_error: 'A quantidade deve ser um valor inteiro',
    })
    .int(),
})
export type ItemSchemaType = z.infer<typeof itemSchema>

export const itemSchemaForm = itemSchema.pick({
  name: true,
  amount: true,
  totalAmount: true,
})
export type ItemSchemaFormType = z.infer<typeof itemSchemaForm>

export const editItemSchemaForm = z.object({
  id: z.string().uuid().optional(),
  amount: z.number().int().optional(),
  totalAmount: z.number().int().optional(),
})
export type EditItemSchemaFormType = z.infer<typeof editItemSchemaForm>

export const controlSchema = z.object({
  id: z.string().uuid(),
  newAmount: z.number().int(),
  lastAmount: z.number().int(),
  newAmountStock: z.number().int(),
  lastAmountStock: z.number().int(),
  modifiedAt: z.date(),
  User: userSchema.pick({
    name: true,
    lastName: true,
  }),
  Item: itemSchema.pick({
    id: true,
    name: true,
  }),
})
export type ControlSchemaType = z.infer<typeof controlSchema>

export const editUserPermissionSchema = z.object({
  userIdToUpdate: z.string().uuid(),
})
export type EditUserPermissionSchemaType = z.infer<
  typeof editUserPermissionSchema
>

import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserValidator {
  constructor (protected ctx: HttpContextContract, protected user: User | null) { }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string(),
    email: schema.string({}, [
      rules.email(),
      rules.unique(
        this.user ?
          { table: 'users', column: 'email', whereNot: { id: this.user.id } } :
          { table: 'users', column: 'email' }
      ),
    ]),
    password: this.user ?
      schema.string.optional({}, [rules.minLength(8)]) :
      schema.string({}, [rules.minLength(8)]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.required': 'Le champ nom est obligatoire.',
    'email.required': 'Le champ email est obligatoire.',
    'email.email': 'Veuillez entrer une adresse email valide.',
    'email.unique': 'L\'email est deja en cours d\'utilisation.',
    'password.required': 'Le champ mot de passe est obligatoire.',
    'password.minLength': 'Le mot de passe doit contenir au moins 8 caracteres.',
  }
}

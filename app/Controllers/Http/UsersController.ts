import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import UserValidator from 'App/Validators/UserValidator'

export default class UsersController {
  public async index ({ view }) {
    const users = await User.query()

    return view.render('admin/users/index', { users })
  }

  public async create ({ view }) {
    return view.render('admin/users/create')
  }

  public async store ({ request, response, session }) {
    try {
      await request.validate(UserValidator)
      const data = request.only(['name', 'email', 'password', 'role'])

      await User.create(data)

      session.flash('success', 'Utilisateur créé avec succès')

      return response.redirect().toRoute('admin_users.index')
    } catch (error) {
      if(error.flashToSession){
        session.flash('errors', error.messages)
      } else {
        session.flash('error', 'Une erreur s\'est produite lors de l\'inscription. Veuillez vérifier vos informations et réessayer.')
      }
      return response.redirect().back()
    }
  }

  public async edit ({ params, view }) {
    const user = await User.findOrFail(params.id)

    return view.render('admin/users/edit', { user })
  }

  public async update (ctx: HttpContextContract) {
    const { request, params, response, session } = ctx
    try {
      const user = await User.findOrFail(params.id)

      await request.validate(new UserValidator(ctx, user))

      user.merge(request.only(['name', 'email', 'role']))

      const password = request.input('password')
      if (password) {
        user.password = password
      }
      await user.save()

      session.flash('success', 'L\'utilisateur a modifié avec succès')
      return response.redirect().toRoute('admin_users.index')
    } catch (error) {
      if(error.flashToSession){
        session.flash('errors', error.messages)
      } else {
        session.flash('error', 'Une erreur s\'est produite lors de l\'enregistrement. Veuillez vérifier vos données et réessayer.')
      }
      return response.redirect().back()
    }
  }

  public async destroy ({ params, response, session }) {
    try {
      const user = await User.findOrFail(params.id)

      await user.delete()

      session.flash('success', 'L\'utilisateur a supprimé avec succès')
      return response.redirect().toRoute('admin_users.index')
    } catch (error) {
      session.flash('error', 'Une erreur s\'est produite lors de la suppression. Veuillez réessayer plus tard.')
      return response.redirect().back()
    }
  }
}

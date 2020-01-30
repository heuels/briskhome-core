/** @flow
 * @briskhome
 * └core.graphql <queries/me.js>
 */
import UserType from "../types/User";
import { Context } from "../../utilities/coreTypes";
export default {
  type: UserType,
  resolve: async (src: object, args: {}, ctx: Context) => {
    const {
      db,
      req: {
        user
      }
    } = ctx;
    const UserModel = db.model('core:user');
    if (!user) return null;
    return UserModel.fetchByUsername(user.username, {
      lean: true
    });
  }
};
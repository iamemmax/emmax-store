import { FilterQuery, QueryOptions, Schema } from "mongoose"
import userModel, { UserProps } from "../model/users.model"


export interface userIdProp {
    userId: Schema.Types.ObjectId
}
export const getUser = async (query: FilterQuery<userIdProp>, option: QueryOptions = { lean: true }) => {
    return await userModel.findOne(query).select("-password")
}
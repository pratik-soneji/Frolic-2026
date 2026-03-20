export type User = {
  _id: string
  email: string
  userName: string
  phone: Number
  avatar?: string
  isAdmin: boolean
  isCordinator: boolean
  coordinatorType: "student" | "institute" | "department" | "event" | null
}
export type LoginResponse = {
  user: User
  accessToken: string
  refreshToken: string
}
// export type Event = {
//   _id: string,
//   eventName: string,
//   eventTagline?: string,
// }
export type GetAllUsersResponse = {
  data: User[];
  message: string;
  statusCode: boolean;
}

export type UUID = string

export type User = {
  id: UUID
  username: string
  email: string
}

export type Post = {
  id: UUID
  authorId: UUID
  title: string
  content: string
  likes: number
  likedByMe?: boolean
  createdAt: string
  comments?: Comment[]
}

export type Comment = {
  id: UUID
  postId: UUID
  authorId: UUID
  content: string
  createdAt: string
}

export type NotificationType = 'newPost' | 'like' | 'comment'

export type NotificationItem = {
  id: string
  type: NotificationType
  message: string
  at: number
}

export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}

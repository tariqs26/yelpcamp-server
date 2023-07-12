import express from "express"

declare global {
  namespace Express {
    interface User {
      username: string
      isAdmin: boolean
      _id: number
    }
  }
}

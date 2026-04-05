import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRouter from "./routers/admin.route.js"
const app = express()

const corsOptions = {
  origin: ["http://localhost:5173", "https://frolic-2026-hski.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())
app.use(express.static("public"))

import userRouter from "./routers/user.route.js"
import eventRouter from "./routers/event.routes.js"
import participantRouter from "./routers/participant.routes.js"

app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/api/events", eventRouter)
app.use("/api/participants", participantRouter)

export { app }

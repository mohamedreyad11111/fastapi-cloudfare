import { Hono } from 'hono'

const app = new Hono()

// تسجيل مستخدم جديد
app.post('/register', async (c) => {
  const body = await c.req.json()
  const { email, password, name } = body

  const exists = await USERS.get(email)
  if (exists) return c.text('❌ Account already exists!', 409)

  await USERS.put(email, JSON.stringify({ name, password }))
  return c.text('✅ Registered successfully')
})

// تسجيل الدخول
app.post('/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  const data = await USERS.get(email)
  if (!data) return c.text('❌ Not found', 404)

  const user = JSON.parse(data)
  if (user.password !== password) return c.text('❌ Wrong password', 401)

  return c.text('✅ Logged in successfully')
})

// إظهار كل المستخدمين (للإدمن فقط)
app.get('/admin/users', async (c) => {
  const list = await USERS.list()
  const users = await Promise.all(list.keys.map(k => USERS.get(k.name)))
  return c.json(users.map(data => JSON.parse(data)))
})

export default app

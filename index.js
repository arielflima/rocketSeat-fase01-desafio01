const express = require('express')
const server = express()

const projects = [{ id: "0", title: "Novo Projeto", tasks: [] }]

server.use(express.json())

let countReq = 0

server.use((req, res, next) => {
  countReq++
  console.log(`Number of requisitions: ${countReq}`)
  next()
})

const checkProject = (req, res, next) => {
  const { id } = req.params
  const project = projects.find(i => i.id == id)

  if (!project) {
    return res.status(400).json({ error: 'Project not found!' })
  }
  return next()
}

server.get('/projects', (req, res) => {
  return res.json(projects)
})

server.post('/projects', (req, res) => {
  const { id, title } = req.body

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  return res.json(project)
})

server.post('/projects/:id/tasks', checkProject, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(i => i.id == id)

  project.tasks.push(title)

  return res.json(project)
})


server.put('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(i => i.id == id)
  project.title = title

  return res.json(project)
})


server.delete('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params
  const index = projects.indexOf({ id })
  projects.splice(index, 1)

  return res.send()
})

server.listen(3000)